import React from 'react';

const GameInfo = ({ roomId, myColor, currentPlayer, gameOver, winner, message, onUndo, onReset }) => {
  const getPlayerText = (player) => player === 1 ? '⚫ 黑棋' : '⚪ 白棋';
  
  return (
    <>
      <div className="game-info text-center mb-3">
        <div className="alert alert-secondary">
          <strong>房间号:</strong> {roomId} | 
          <strong> 你的颜色:</strong> {getPlayerText(myColor)} | 
          <strong> 当前回合:</strong> {getPlayerText(currentPlayer)}
        </div>
        {message && (
          <div className={`alert ${gameOver ? 'alert-success' : 'alert-info'}`}>
            {gameOver ? (winner === myColor ? '🎉 你赢了！' : '😢 你输了！') : message}
          </div>
        )}
      </div>
      <div className="text-center mt-4">
        <button 
          className="btn btn-warning me-2" 
          onClick={onUndo}
          disabled={gameOver}
        >
          悔棋
        </button>
        <button 
          className="btn btn-danger" 
          onClick={onReset}
        >
          重新开始
        </button>
      </div>
    </>
  );
};

export default GameInfo;