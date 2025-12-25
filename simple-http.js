const http = require('http');
const fs = require('fs');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');
const express = require('express');

// 创建Express应用
const app = express();

// 中间件：记录请求
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  next();
});

// 提供当前目录的静态文件
app.use(express.static(__dirname));

// 代理Socket.io
app.use('/socket.io', createProxyMiddleware({
  target: 'http://localhost:3001',
  changeOrigin: true,
  ws: true
}));

// 首页路由
app.get('/', (req, res) => {
  const htmlPath = path.join(__dirname, 'simple-index.html');
  if (fs.existsSync(htmlPath)) {
    res.sendFile(htmlPath);
  } else {
    res.send(`
      <html>
        <body>
          <h1>五子棋游戏</h1>
          <p>服务器运行正常！</p>
          <p>后端健康检查: <a href="/health-proxy">点击这里</a></p>
          <p>或者访问: <a href="http://localhost:3001/health">http://localhost:3001/health</a></p>
        </body>
      </html>
    `);
  }
});

// 代理后端健康检查
app.get('/health-proxy', createProxyMiddleware({
  target: 'http://localhost:3001',
  changeOrigin: true,
  pathRewrite: { '^/health-proxy': '/health' }
}));

const PORT = 8080;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ 服务器运行在 http://localhost:${PORT}`);
  console.log(`🌐 外网访问: http://0.0.0.0:${PORT}`);
  console.log(`📱 请访问: http://localhost:${PORT}`);
});