/**
 * render-server.js
 * 专门为 Render 部署优化的单服务版本
 * 合并了后端游戏逻辑和前端代理功能
 */

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const GobangGame = require('./backend/gameLogic');

// 创建 Express 应用和 HTTP 服务器
const app = express();
const server = http.createServer(app);

// 配置 Socket.io
const io = socketIo(server, {
  cors: {
    origin: "*", // 允许所有来源（生产环境可以限制）
    methods: ["GET", "POST"],
    credentials: true
  },
  pingTimeout: 60000,
  pingInterval: 25000
});

// 中间件
app.use(express.json());

// ==================== 游戏逻辑部分 ====================
// 这部分从 backend/server.js 复制而来

const rooms = new Map();        // 房间数据：roomId -> { game, players, playerColors, createdAt }
const playerRooms = new Map();  // 玩家所在房间：playerId -> roomId

// 清理空闲房间（每5分钟）
const cleanupRooms = () => {
  const now = Date.now();
  for (const [roomId, room] of rooms.entries()) {
    if (room.players.length === 0) {
      rooms.delete(roomId);
      console.log(`清理空闲房间: ${roomId}`);
    }
  }
};
setInterval(cleanupRooms, 5 * 60 * 1000);

// Socket.io 事件处理
io.on('connection', (socket) => {
  console.log('新玩家连接:', socket.id);

  // 创建房间
  socket.on('createRoom', () => {
    const roomId = Math.random().toString(36).substring(2, 8).toUpperCase();
    const game = new GobangGame();
    rooms.set(roomId, {
      game,
      players: [socket.id],
      playerColors: { [socket.id]: 1 }, // 1=黑棋，2=白棋
      createdAt: Date.now()
    });
    playerRooms.set(socket.id, roomId);
    socket.join(roomId);
    socket.emit('roomCreated', { roomId, color: 1 });
    console.log(`房间创建: ${roomId}, 玩家: ${socket.id}`);
  });

  // 加入房间
  socket.on('joinRoom', (roomId) => {
    // 输入验证
    if (!roomId || typeof roomId !== 'string' || roomId.length !== 6) {
      socket.emit('error', '无效的房间号');
      return;
    }

    const room = rooms.get(roomId.toUpperCase());
    if (!room) {
      socket.emit('error', '房间不存在');
      return;
    }
    if (room.players.length >= 2) {
      socket.emit('error', '房间已满');
      return;
    }
    
    room.players.push(socket.id);
    room.playerColors[socket.id] = 2; // 第二个玩家是白棋
    playerRooms.set(socket.id, roomId);
    socket.join(roomId);
    socket.emit('roomJoined', { roomId, color: 2 });
    io.to(roomId).emit('gameStart', room.game.getState());
    console.log(`玩家加入房间: ${roomId}, 玩家: ${socket.id}`);
  });

  // 下棋
  socket.on('makeMove', ({ roomId, row, col }) => {
    // 输入验证
    if (!roomId || typeof row !== 'number' || typeof col !== 'number') {
      socket.emit('error', '无效的输入参数');
      return;
    }
    if (row < 0 || row >= 15 || col < 0 || col >= 15) {
      socket.emit('error', '坐标超出范围');
      return;
    }

    const room = rooms.get(roomId);
    if (!room) {
      socket.emit('error', '房间不存在');
      return;
    }

    const playerColor = room.playerColors[socket.id];
    if (!playerColor) {
      socket.emit('error', '你不是这个房间的玩家');
      return;
    }
    if (room.game.currentPlayer !== playerColor) {
      socket.emit('error', '不是你的回合');
      return;
    }

    const success = room.game.makeMove(row, col);
    if (success) {
      io.to(roomId).emit('gameUpdate', room.game.getState());
      if (room.game.gameOver) {
        io.to(roomId).emit('gameOver', { winner: room.game.winner });
      }
    } else {
      socket.emit('error', '无效的移动');
    }
  });

  // 悔棋
  socket.on('undo', (roomId) => {
    const room = rooms.get(roomId);
    if (!room) {
      socket.emit('error', '房间不存在');
      return;
    }

    const playerColor = room.playerColors[socket.id];
    if (!playerColor) {
      socket.emit('error', '你不是这个房间的玩家');
      return;
    }

    const success = room.game.undo();
    if (success) {
      io.to(roomId).emit('gameUpdate', room.game.getState());
    } else {
      socket.emit('error', '无法悔棋');
    }
  });

  // 重新开始
  socket.on('resetGame', (roomId) => {
    const room = rooms.get(roomId);
    if (!room) {
      socket.emit('error', '房间不存在');
      return;
    }

    const playerColor = room.playerColors[socket.id];
    if (!playerColor) {
      socket.emit('error', '你不是这个房间的玩家');
      return;
    }

    room.game.reset();
    io.to(roomId).emit('gameUpdate', room.game.getState());
  });

  // 获取复盘信息
  socket.on('getReplayInfo', (roomId) => {
    const room = rooms.get(roomId);
    if (!room) {
      socket.emit('error', '房间不存在');
      return;
    }

    const playerColor = room.playerColors[socket.id];
    if (!playerColor) {
      socket.emit('error', '你不是这个房间的玩家');
      return;
    }

    const replayInfo = room.game.getReplayInfo();
    const moveStats = room.game.getMoveStats();
    
    socket.emit('replayInfo', {
      ...replayInfo,
      stats: moveStats
    });
  });

  // 断开连接
  socket.on('disconnect', () => {
    console.log('玩家断开连接:', socket.id);
    
    const roomId = playerRooms.get(socket.id);
    if (roomId) {
      const room = rooms.get(roomId);
      if (room) {
        // 从房间中移除玩家
        room.players = room.players.filter(id => id !== socket.id);
        delete room.playerColors[socket.id];
        
        // 通知其他玩家
        if (room.players.length > 0) {
          io.to(roomId).emit('playerLeft', { playerId: socket.id });
        } else {
          console.log(`房间 ${roomId} 变为空闲`);
        }
      }
      playerRooms.delete(socket.id);
    }
  });
});

// ==================== 静态文件服务部分 ====================
// 这部分从 proxy-server.js 复制而来，但做了适配

// 静态文件服务（前端构建产物）
app.use(express.static(path.join(__dirname, 'frontend/build')));

// ==================== API 端点 ====================

// 健康检查端点（Render 需要）
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    rooms: rooms.size,
    connections: io.engine.clientsCount,
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// 房间信息端点（可选）
app.get('/api/rooms', (req, res) => {
  const roomList = Array.from(rooms.entries()).map(([id, room]) => ({
    id,
    players: room.players.length,
    gameOver: room.game.gameOver,
    createdAt: new Date(room.createdAt).toISOString()
  }));
  res.json({ rooms: roomList });
});

// 服务器信息端点
app.get('/api/info', (req, res) => {
  res.json({
    name: '五子棋在线对战游戏',
    version: '1.0.0',
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    platform: process.platform,
    nodeVersion: process.version
  });
});

// ==================== 前端路由处理 ====================
// 所有其他请求返回前端应用（支持前端路由）
// 使用正则表达式匹配所有未匹配的路由
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/build', 'index.html'));
});

// ==================== 启动服务器 ====================
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

server.listen(PORT, HOST, () => {
  console.log('========================================');
  console.log('🎮 五子棋在线对战游戏 - 单服务版本');
  console.log('========================================');
  console.log(`服务器运行在: http://${HOST}:${PORT}`);
  console.log(`健康检查: http://${HOST}:${PORT}/health`);
  console.log(`API 信息: http://${HOST}:${PORT}/api/info`);
  console.log(`房间列表: http://${HOST}:${PORT}/api/rooms`);
  console.log('========================================');
  console.log('游戏功能:');
  console.log('  - 创建房间: Socket.io 事件 "createRoom"');
  console.log('  - 加入房间: Socket.io 事件 "joinRoom"');
  console.log('  - 下棋: Socket.io 事件 "makeMove"');
  console.log('  - 悔棋: Socket.io 事件 "undo"');
  console.log('  - 重新开始: Socket.io 事件 "resetGame"');
  console.log('========================================');
});