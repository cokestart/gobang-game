import React, { memo, useCallback } from 'react';
import './Board.css';

const Cell = memo(({ cell, rowIndex, colIndex, gameOver, onCellClick }) => {
  const handleClick = useCallback(() => {
    if (!gameOver && cell === 0) {
      onCellClick(rowIndex, colIndex);
    }
  }, [gameOver, cell, rowIndex, colIndex, onCellClick]);

  return (
    <div
      className={`board-cell ${cell !== 0 ? 'occupied' : ''}`}
      onClick={handleClick}
    >
      {cell === 1 && <div className="piece black"></div>}
      {cell === 2 && <div className="piece white"></div>}
    </div>
  );
});

const Row = memo(({ row, rowIndex, gameOver, onCellClick }) => (
  <div key={rowIndex} className="board-row">
    {row.map((cell, colIndex) => (
      <Cell
        key={colIndex}
        cell={cell}
        rowIndex={rowIndex}
        colIndex={colIndex}
        gameOver={gameOver}
        onCellClick={onCellClick}
      />
    ))}
  </div>
));

const Board = memo(({ board, onCellClick, gameOver }) => {
  const handleCellClick = useCallback((row, col) => {
    onCellClick(row, col);
  }, [onCellClick]);

  return (
    <div className="board-wrapper">
      <div className="board-container">
        <div className="board">
          {board.map((row, rowIndex) => (
            <Row
              key={rowIndex}
              row={row}
              rowIndex={rowIndex}
              gameOver={gameOver}
              onCellClick={handleCellClick}
            />
          ))}
        </div>
      </div>
    </div>
  );
});

export default Board;
