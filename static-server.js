const express = require('express');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// 提供静态HTML文件
app.use(express.static(__dirname));

// 代理Socket.io到后端
app.use('/socket.io', createProxyMiddleware({
  target: 'http://localhost:3001',
  changeOrigin: true,
  ws: true
}));

// 所有请求返回简单页面
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'simple-index.html'));
});

app.get('*', (req, res) => {
  res.redirect('/');
});

const PORT = 8080;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 静态服务器运行在端口 ${PORT}`);
  console.log(`📱 本地访问: http://localhost:${PORT}`);
  console.log(`🌐 外网访问: http://0.0.0.0:${PORT}`);
  console.log(`📄 服务文件: simple-index.html`);
});