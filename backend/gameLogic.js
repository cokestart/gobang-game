class GobangGame {
  constructor() {
    this.board = Array(15).fill(null).map(() => Array(15).fill(0));
    this.currentPlayer = 1;
    this.gameOver = false;
    this.winner = null;
    this.history = [];
    this.replayMode = false;
    this.replayIndex = 0;
    this.replayHistory = []; // 专门用于复盘的历史记录
    this.startTime = Date.now();
  }

  reset() {
    this.board = Array(15).fill(null).map(() => Array(15).fill(0));
    this.currentPlayer = 1;
    this.gameOver = false;
    this.winner = null;
    this.history = [];
    this.replayMode = false;
    this.replayIndex = 0;
    this.replayHistory = [];
    this.startTime = Date.now();
  }

  makeMove(row, col) {
    if (this.gameOver || this.board[row][col] !== 0) {
      return false;
    }

    this.board[row][col] = this.currentPlayer;
    const move = { 
      row, 
      col, 
      player: this.currentPlayer,
      timestamp: Date.now() - this.startTime,
      step: this.history.length + 1
    };
    this.history.push(move);
    this.replayHistory.push(move); // 同时记录到复盘历史

    if (this.checkWin(row, col)) {
      this.gameOver = true;
      this.winner = this.currentPlayer;
      return true;
    }

    this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
    return true;
  }

  undo() {
    if (this.history.length === 0) {
      return false;
    }

    const lastMove = this.history.pop();
    this.board[lastMove.row][lastMove.col] = 0;
    this.currentPlayer = lastMove.player;
    this.gameOver = false;
    this.winner = null;
    return true;
  }

  // 获取复盘信息（简化的最终棋面）
  getReplayInfo() {
    return {
      totalSteps: this.replayHistory.length,
      finalBoard: this.board, // 最终棋盘状态
      winner: this.winner,
      gameOver: this.gameOver,
      history: this.replayHistory.map(move => ({
        step: move.step,
        player: move.player,
        row: move.row,
        col: move.col,
        time: Math.floor(move.timestamp / 1000) // 转换为秒
      }))
    };
  }

  // 获取走子统计
  getMoveStats() {
    const stats = {
      blackMoves: 0,
      whiteMoves: 0,
      blackPositions: [],
      whitePositions: []
    };
    
    this.replayHistory.forEach(move => {
      if (move.player === 1) {
        stats.blackMoves++;
        stats.blackPositions.push({ row: move.row, col: move.col });
      } else {
        stats.whiteMoves++;
        stats.whitePositions.push({ row: move.row, col: move.col });
      }
    });
    
    return stats;
  }

  checkWin(row, col) {
    const player = this.board[row][col];
    const directions = [
      [0, 1],   // 水平
      [1, 0],   // 垂直
      [1, 1],   // 主对角线
      [1, -1]   // 副对角线
    ];

    for (const [dx, dy] of directions) {
      let count = 1;
      
      // 正向检查
      for (let i = 1; i < 5; i++) {
        const newRow = row + dx * i;
        const newCol = col + dy * i;
        // 提前检查边界
        if (newRow < 0 || newRow >= 15 || newCol < 0 || newCol >= 15) break;
        if (this.board[newRow][newCol] !== player) break;
        count++;
      }

      // 反向检查
      for (let i = 1; i < 5; i++) {
        const newRow = row - dx * i;
        const newCol = col - dy * i;
        if (newRow < 0 || newRow >= 15 || newCol < 0 || newCol >= 15) break;
        if (this.board[newRow][newCol] !== player) break;
        count++;
      }

      if (count >= 5) {
        return true;
      }
    }

    return false;
  }

  getState() {
    return {
      board: this.board,
      currentPlayer: this.currentPlayer,
      gameOver: this.gameOver,
      winner: this.winner
    };
  }
}

module.exports = GobangGame;
