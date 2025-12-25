const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const GobangGame = require('./gameLogic');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*", // 允许所有来源
    methods: ["GET", "POST"],
    credentials: true
  },
  pingTimeout: 60000,
  pingInterval: 25000
});

app.use(cors());
app.use(express.json());

const rooms = new Map();
const playerRooms = new Map(); // 跟踪玩家所在的房间

// 清理空闲房间
const cleanupRooms = () => {
  const now = Date.now();
  for (const [roomId, room] of rooms.entries()) {
    if (room.players.length === 0) {
      rooms.delete(roomId);
      console.log(`清理空闲房间: ${roomId}`);
    }
  }
};

// 每5分钟清理一次空闲房间
setInterval(cleanupRooms, 5 * 60 * 1000);

io.on('connection', (socket) => {
  console.log('新玩家连接:', socket.id);

  socket.on('createRoom', () => {
    const roomId = Math.random().toString(36).substring(2, 8).toUpperCase();
    const game = new GobangGame();
    rooms.set(roomId, {
      game,
      players: [socket.id],
      playerColors: { [socket.id]: 1 },
      createdAt: Date.now()
    });
    playerRooms.set(socket.id, roomId);
    socket.join(roomId);
    socket.emit('roomCreated', { roomId, color: 1 });
    console.log(`房间创建: ${roomId}, 玩家: ${socket.id}`);
  });

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
    room.playerColors[socket.id] = 2;
    playerRooms.set(socket.id, roomId);
    socket.join(roomId);
    socket.emit('roomJoined', { roomId, color: 2 });
    io.to(roomId).emit('gameStart', room.game.getState());
    console.log(`玩家加入房间: ${roomId}, 玩家: ${socket.id}`);
  });

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

  // 获取复盘信息（最终棋面）
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
          // 房间为空，标记为待清理
          console.log(`房间 ${roomId} 变为空闲`);
        }
      }
      playerRooms.delete(socket.id);
    }
  });
});

// 健康检查端点
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    rooms: rooms.size,
    connections: io.engine.clientsCount,
    timestamp: new Date().toISOString()
  });
});

// 房间信息端点
app.get('/rooms', (req, res) => {
  const roomList = Array.from(rooms.entries()).map(([id, room]) => ({
    id,
    players: room.players.length,
    gameOver: room.game.gameOver,
    createdAt: new Date(room.createdAt).toISOString()
  }));
  res.json({ rooms: roomList });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`服务器运行在端口 ${PORT}`);
  console.log(`本地访问: http://localhost:${PORT}`);
  console.log(`外网访问: http://0.0.0.0:${PORT}`);
  console.log(`健康检查: http://localhost:${PORT}/health`);
});
