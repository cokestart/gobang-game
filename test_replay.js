// 测试完整的复盘功能
const GobangGame = require('./backend/gameLogic');

console.log('=== 测试五子棋复盘功能 ===\n');

// 创建游戏
const game = new GobangGame();

// 模拟一场游戏（黑棋胜）
const moves = [
  {row: 7, col: 7, player: 1}, // 黑棋
  {row: 7, col: 8, player: 2}, // 白棋
  {row: 8, col: 7, player: 1}, // 黑棋
  {row: 8, col: 8, player: 2}, // 白棋
  {row: 9, col: 7, player: 1}, // 黑棋
  {row: 9, col: 8, player: 2}, // 白棋
  {row: 10, col: 7, player: 1}, // 黑棋
  {row: 10, col: 8, player: 2}, // 白棋
  {row: 11, col: 7, player: 1}, // 黑棋 - 五连珠，黑胜
];

console.log('模拟走棋过程:');
moves.forEach((move, index) => {
  const result = game.makeMove(move.row, move.col, move.player);
  console.log(`第${index + 1}步: ${move.player === 1 ? '⚫ 黑棋' : '⚪ 白棋'} (${move.row + 1}, ${move.col + 1})`);
  if (result && result.winner) {
    console.log(`🎉 游戏结束! 胜利者: ${result.winner === 1 ? '⚫ 黑棋' : '⚪ 白棋'}`);
  }
});

console.log('\n=== 复盘信息 ===');
const replayInfo = game.getReplayInfo();
console.log('总步数:', replayInfo.totalSteps);
console.log('胜利者:', replayInfo.winner === 1 ? '⚫ 黑棋' : '⚪ 白棋');
console.log('游戏结束:', replayInfo.gameOver ? '是' : '否');

console.log('\n=== 走子统计 ===');
const stats = game.getMoveStats();
console.log('黑棋步数:', stats.blackMoves);
console.log('白棋步数:', stats.whiteMoves);
console.log('黑棋位置:', stats.blackPositions.map(p => `(${p.row + 1},${p.col + 1})`).join(', '));
console.log('白棋位置:', stats.whitePositions.map(p => `(${p.row + 1},${p.col + 1})`).join(', '));

console.log('\n=== 走棋历史 ===');
replayInfo.history.forEach(move => {
  console.log(`第${move.step}步: ${move.player === 1 ? '⚫ 黑棋' : '⚪ 白棋'} (${move.row + 1}, ${move.col + 1}) - ${move.time}秒`);
});

console.log('\n✅ 复盘功能测试完成！');
console.log('前端会显示：');
console.log('1. 总步数、黑白棋步数统计');
console.log('2. 胜负结果');
console.log('3. 黑白棋各自的所有位置');
console.log('4. 完整的走棋历史记录');
