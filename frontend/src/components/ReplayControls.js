import React from 'react';
import './ReplayControls.css';

const ReplayControls = ({ 
  socket, 
  roomId, 
  replayInfo 
}) => {
  const handleShowReplay = () => {
    // 发送请求获取复盘信息
    socket.emit('getReplayInfo', roomId);
  };

  const handleExportReplay = () => {
    if (!replayInfo || !replayInfo.history) return;
    
    // 创建复盘文本
    const replayText = `五子棋复盘记录
房间号: ${roomId}
总步数: ${replayInfo.totalSteps}
对局时间: ${new Date().toLocaleString()}

走棋记录:
${replayInfo.history.map((move, index) => 
  `第${index + 1}步: ${move.player === 1 ? '黑棋' : '白棋'} (${move.row + 1}, ${move.col + 1}) - ${move.time}秒`
).join('\n')}`;

    // 下载文件
    const blob = new Blob([replayText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `五子棋复盘_${roomId}_${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // 统计双方走棋数
  const getMoveStats = () => {
    if (!replayInfo || !replayInfo.history) return { black: 0, white: 0 };
    
    const blackMoves = replayInfo.history.filter(move => move.player === 1).length;
    const whiteMoves = replayInfo.history.filter(move => move.player === 2).length;
    
    return { black: blackMoves, white: whiteMoves };
  };

  const stats = getMoveStats();

  return (
    <div className="replay-controls">
      <div className="replay-header">
        <h5>📊 棋局复盘</h5>
        <div className="replay-actions">
          <button 
            className="btn btn-primary btn-sm me-2"
            onClick={handleShowReplay}
            disabled={!replayInfo || replayInfo.totalSteps === 0}
          >
            查看复盘
          </button>
          <button 
            className="btn btn-success btn-sm"
            onClick={handleExportReplay}
            disabled={!replayInfo || replayInfo.totalSteps === 0}
          >
            导出记录
          </button>
        </div>
      </div>
      
      {replayInfo && replayInfo.totalSteps > 0 ? (
        <div className="replay-content">
          <div className="replay-stats">
            <div className="stat-item">
              <span className="stat-label">总步数:</span>
              <span className="stat-value">{replayInfo.totalSteps}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">黑棋:</span>
              <span className="stat-value">● {stats.black}步</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">白棋:</span>
              <span className="stat-value">○ {stats.white}步</span>
            </div>
          </div>
          
          <div className="replay-history">
            <small>最近走棋记录:</small>
            <div className="history-list">
              {replayInfo.history.slice(-8).map((move, index) => (
                <div key={index} className="history-item">
                  <span>第{move.step}步: {move.player === 1 ? '● 黑棋' : '○ 白棋'} ({move.row + 1}, {move.col + 1})</span>
                  <small>{move.time}秒</small>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="replay-info">
          <small className="text-muted">暂无棋局记录，请先完成一局游戏</small>
        </div>
      )}
    </div>
  );
};

export default ReplayControls;