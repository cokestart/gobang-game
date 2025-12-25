import React, { useState, useEffect, useCallback } from 'react';
import io from 'socket.io-client';
import Board from './components/Board';
import RoomManager from './components/RoomManager';
import GameInfo from './components/GameInfo';
import ReplayView from './components/ReplayView';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// 创建Socket连接
const createSocket = () => {
  // 统一使用当前访问的地址，Socket.io通过代理服务器转发
  const socketURL = window.location.origin;
  
  console.log('Socket连接URL:', socketURL);
  console.log('访问地址:', window.location.href);
  
  return io(socketURL, {
    path: '/socket.io',
    transports: ['websocket', 'polling'],
    timeout: 20000,
    forceNew: true,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000
  });
};

function App() {
  const [socket, setSocket] = useState(null);
  const [board, setBoard] = useState(() => Array(15).fill(null).map(() => Array(15).fill(0)));
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const [roomId, setRoomId] = useState('');
  const [myColor, setMyColor] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [message, setMessage] = useState('');
  const [connected, setConnected] = useState(false);

  // 初始化Socket连接
  useEffect(() => {
    const newSocket = createSocket();
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Socket事件监听
  useEffect(() => {
    if (!socket) return;

    const handleConnect = () => {
      console.log('Socket连接成功，ID:', socket.id);
      setConnected(true);
      setMessage('已连接到服务器');
    };

    const handleDisconnect = () => {
      console.log('Socket连接断开');
      setConnected(false);
      setMessage('与服务器断开连接');
    };

    const handleConnectError = (error) => {
      console.error('Socket连接错误:', error);
      setMessage('连接服务器失败，正在重试...');
    };

    const handleRoomCreated = ({ roomId, color }) => {
      console.log('房间创建成功:', roomId);
      setRoomId(roomId);
      setMyColor(color);
      setMessage(`房间已创建！房间号: ${roomId}，等待对手加入...`);
    };

    const handleRoomJoined = ({ roomId, color }) => {
      setRoomId(roomId);
      setMyColor(color);
      setMessage('已加入房间，等待游戏开始...');
    };

    const handleGameStart = (state) => {
      setBoard(state.board);
      setCurrentPlayer(state.currentPlayer);
      setGameStarted(true);
      setMessage('游戏开始！');
    };

    const handleGameUpdate = (state) => {
      setBoard(state.board);
      setCurrentPlayer(state.currentPlayer);
      setGameOver(state.gameOver);
      setWinner(state.winner);
    };

    const handleGameOver = ({ winner }) => {
      setGameOver(true);
      setWinner(winner);
    };

    const handlePlayerLeft = () => {
      setMessage('对手已离开游戏');
      setGameStarted(false);
    };

    const handleError = (msg) => {
      setMessage(`错误: ${msg}`);
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('connect_error', handleConnectError);
    socket.on('roomCreated', handleRoomCreated);
    socket.on('roomJoined', handleRoomJoined);
    socket.on('gameStart', handleGameStart);
    socket.on('gameUpdate', handleGameUpdate);
    socket.on('gameOver', handleGameOver);
    socket.on('playerLeft', handlePlayerLeft);
    socket.on('error', handleError);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('connect_error', handleConnectError);
      socket.off('roomCreated', handleRoomCreated);
      socket.off('roomJoined', handleRoomJoined);
      socket.off('gameStart', handleGameStart);
      socket.off('gameUpdate', handleGameUpdate);
      socket.off('gameOver', handleGameOver);
      socket.off('playerLeft', handlePlayerLeft);
      socket.off('error', handleError);
    };
  }, [socket]);

  const handleCellClick = useCallback((row, col) => {
    if (socket && currentPlayer === myColor && !gameOver && roomId) {
      socket.emit('makeMove', { roomId, row, col });
    }
  }, [socket, currentPlayer, myColor, gameOver, roomId]);

  const handleUndo = useCallback(() => {
    if (socket && roomId) {
      socket.emit('undo', roomId);
    }
  }, [socket, roomId]);

  const handleReset = useCallback(() => {
    if (socket && roomId) {
      socket.emit('resetGame', roomId);
      setGameOver(false);
      setWinner(null);
      setMessage('游戏已重置');
    }
  }, [socket, roomId]);

  if (!socket) {
    return <div className="text-center mt-5">正在初始化连接...</div>;
  }

  return (
    <div className="App">
      <div className="container py-4">
        <div className="card shadow-lg">
          <div className="card-header bg-primary text-white text-center">
            <h1 className="mb-0">🎮 五子棋在线对战</h1>
            {!connected && (
              <small className="text-warning">（连接中...）</small>
            )}
          </div>
          <div className="card-body">
            {!gameStarted ? (
              <RoomManager
                socket={socket}
                message={message}
                setMessage={setMessage}
              />
            ) : (
              <>
                <GameInfo
                  roomId={roomId}
                  myColor={myColor}
                  currentPlayer={currentPlayer}
                  gameOver={gameOver}
                  winner={winner}
                  message={message}
                  onUndo={handleUndo}
                  onReset={handleReset}
                />
                <Board 
                  board={board} 
                  onCellClick={handleCellClick}
                  gameOver={gameOver}
                />
                
                {gameOver && (
                  <div className="mt-4">
                    <ReplayView 
                      socket={socket}
                      roomId={roomId}
                      gameOver={gameOver}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
