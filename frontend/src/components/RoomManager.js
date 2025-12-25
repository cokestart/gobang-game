import React, { useState } from 'react';

const RoomManager = ({ socket, onRoomCreated, onRoomJoined, onGameStart, message, setMessage }) => {
  const [roomIdInput, setRoomIdInput] = useState('');

  const createRoom = () => {
    setMessage('正在创建房间...');
    socket.emit('createRoom');
  };

  const joinRoom = () => {
    if (!roomIdInput.trim()) {
      setMessage('请输入房间号');
      return;
    }
    socket.emit('joinRoom', roomIdInput.trim());
  };

  return (
    <div className="text-center">
      <div className="mb-4">
        <button className="btn btn-success btn-lg me-3" onClick={createRoom}>
          创建房间
        </button>
        <div className="input-group mt-3" style={{ maxWidth: '400px', margin: '0 auto' }}>
          <input
            type="text"
            className="form-control"
            placeholder="输入房间号"
            value={roomIdInput}
            onChange={(e) => setRoomIdInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && joinRoom()}
          />
          <button className="btn btn-info" onClick={joinRoom}>
            加入房间
          </button>
        </div>
      </div>
      {message && (
        <div className="alert alert-info" role="alert">
          {message}
        </div>
      )}
    </div>
  );
};

export default RoomManager;