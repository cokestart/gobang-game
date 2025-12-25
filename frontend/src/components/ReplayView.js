import React, { useState, useEffect } from 'react';
import './ReplayView.css';

// 棋盘显示组件
const ReplayBoard = ({ blackPositions, whitePositions }) => {
  const boardSize = 15;
  
  // 创建空棋盘
  const createEmptyBoard = () => {
    return Array(boardSize).fill(null).map(() => Array(boardSize).fill(0));
  };
  
  // 标记棋盘上的棋子
  const markBoardPositions = () => {
    const board = createEmptyBoard();
    
    // 标记黑棋位置为1
    blackPositions?.forEach(pos => {
      if (pos.row >= 0 && pos.row < boardSize && pos.col >= 0 && pos.col < boardSize) {
        board[pos.row][pos.col] = 1;
      }
    });
    
    // 标记白棋位置为2
    whitePositions?.forEach(pos => {
      if (pos.row >= 0 && pos.row < boardSize && pos.col >= 0 && pos.col < boardSize) {
        board[pos.row][pos.col] = 2;
      }
    });
    
    return board;
  };
  
  const board = markBoardPositions();
  
  return (
    <div className="replay-board">
      <div className="board-grid">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="board-row">
            {row.map((cell, colIndex) => (
              <div key={colIndex} className="board-cell">
                <div className="cell-inner">
                  {cell === 1 && (
                    <div className="replay-piece black-piece">
                      <span className="piece-number">
                        {blackPositions?.findIndex(p => p.row === rowIndex && p.col === colIndex) + 1}
                      </span>
                    </div>
                  )}
                  {cell === 2 && (
                    <div className="replay-piece white-piece">
                      <span className="piece-number">
                        {whitePositions?.findIndex(p => p.row === rowIndex && p.col === colIndex) + 1}
                      </span>
                    </div>
                  )}
                  {cell === 0 && (
                    <div className="empty-cell">
                      <span className="coordinate">
                        {rowIndex === 0 && colIndex === 0 && 'Ⓐ'}
                        {rowIndex === 7 && colIndex === 7 && '★'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="board-legend">
        <div className="legend-item">
          <div className="legend-color black-legend"></div>
          <span>黑棋位置（带数字表示走棋顺序）</span>
        </div>
        <div className="legend-item">
          <div className="legend-color white-legend"></div>
          <span>白棋位置（带数字表示走棋顺序）</span>
        </div>
        <div className="legend-item">
          <div className="legend-color star-legend">★</div>
          <span>天元位置（棋盘中心）</span>
        </div>
      </div>
    </div>
  );
};

const ReplayView = ({ socket, roomId, gameOver }) => {
  const [showReplay, setShowReplay] = useState(false);
  const [replayInfo, setReplayInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchReplayInfo = () => {
    if (!socket || !roomId) return;
    
    setLoading(true);
    socket.emit('getReplayInfo', roomId);
  };

  useEffect(() => {
    if (!socket) return;

    const handleReplayInfo = (info) => {
      setReplayInfo(info);
      setLoading(false);
    };

    socket.on('replayInfo', handleReplayInfo);

    return () => {
      socket.off('replayInfo', handleReplayInfo);
    };
  }, [socket]);

  const handleToggleReplay = () => {
    if (!showReplay) {
      fetchReplayInfo();
    }
    setShowReplay(!showReplay);
  };

  if (!gameOver) {
    return null;
  }

  return (
    <div className="replay-view">
      <div className="replay-toggle">
        <button 
          className="btn btn-outline-info"
          onClick={handleToggleReplay}
        >
          {showReplay ? '隐藏复盘' : '查看复盘'}
        </button>
      </div>

      {showReplay && (
        <div className="replay-content">
          {loading ? (
            <div className="text-center py-3">
              <div className="spinner-border spinner-border-sm text-primary" role="status">
                <span className="visually-hidden">加载中...</span>
              </div>
              <small className="ms-2">加载复盘信息...</small>
            </div>
          ) : replayInfo ? (
            <>
              <div className="replay-summary">
                <h6>📊 棋局统计</h6>
                <div className="stats-grid">
                  <div className="stat-item">
                    <div className="stat-label">总步数</div>
                    <div className="stat-value">{replayInfo.totalSteps}</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-label">黑棋步数</div>
                    <div className="stat-value">
                      {replayInfo.stats?.blackMoves || 0}
                    </div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-label">白棋步数</div>
                    <div className="stat-value">
                      {replayInfo.stats?.whiteMoves || 0}
                    </div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-label">胜负</div>
                    <div className="stat-value">
                      {replayInfo.winner === 1 ? '⚫ 黑胜' : 
                       replayInfo.winner === 2 ? '⚪ 白胜' : '平局'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="replay-visualization">
                <div className="visualization-header">
                  <h6>🎯 棋盘可视化</h6>
                  <div className="visualization-controls">
                    <button className="btn btn-sm btn-outline-secondary">
                      <small>15×15 标准棋盘</small>
                    </button>
                  </div>
                </div>
                
                {/* 棋盘显示 */}
                <ReplayBoard 
                  blackPositions={replayInfo.stats?.blackPositions}
                  whitePositions={replayInfo.stats?.whitePositions}
                />
                
                <div className="positions-grid mt-3">
                  <div className="position-group">
                    <div className="position-header">
                      <span className="piece-icon black"></span>
                      <span>黑棋位置列表</span>
                    </div>
                    <div className="position-list">
                      {replayInfo.stats?.blackPositions?.map((pos, index) => (
                        <div key={index} className="position-item">
                          <span className="badge bg-dark me-1">{index + 1}</span>
                          ({pos.row + 1}, {pos.col + 1})
                        </div>
                      ))}
                      {(!replayInfo.stats?.blackPositions || replayInfo.stats.blackPositions.length === 0) && (
                        <div className="text-muted">无黑棋记录</div>
                      )}
                    </div>
                  </div>
                  
                  <div className="position-group">
                    <div className="position-header">
                      <span className="piece-icon white"></span>
                      <span>白棋位置列表</span>
                    </div>
                    <div className="position-list">
                      {replayInfo.stats?.whitePositions?.map((pos, index) => (
                        <div key={index} className="position-item">
                          <span className="badge bg-light text-dark me-1">{index + 1}</span>
                          ({pos.row + 1}, {pos.col + 1})
                        </div>
                      ))}
                      {(!replayInfo.stats?.whitePositions || replayInfo.stats.whitePositions.length === 0) && (
                        <div className="text-muted">无白棋记录</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="replay-history">
                <h6>📝 走棋记录</h6>
                <div className="history-list">
                  {replayInfo.history?.map((move, index) => (
                    <div key={index} className="history-item">
                      <div className="move-step">第{move.step}步</div>
                      <div className="move-player">
                        {move.player === 1 ? '⚫' : '⚪'}
                      </div>
                      <div className="move-position">
                        ({move.row + 1}, {move.col + 1})
                      </div>
                      <div className="move-time">{move.time}s</div>
                    </div>
                  ))}
                  {(!replayInfo.history || replayInfo.history.length === 0) && (
                    <div className="text-muted text-center py-2">暂无走棋记录</div>
                  )}
                </div>
              </div>

              <div className="replay-final">
                <h6>🏁 最终棋面</h6>
                <div className="final-info">
                  <p className="mb-2">
                    游戏已结束，最终棋盘包含 {replayInfo.totalSteps} 个棋子。
                    {replayInfo.winner && ` ${replayInfo.winner === 1 ? '黑棋' : '白棋'}获胜。`}
                  </p>
                  <small className="text-muted">
                    提示：棋盘上显示的就是最终的对局结果
                  </small>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-3 text-muted">
              暂无复盘信息
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReplayView;