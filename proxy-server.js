const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const path = require("path");

const app = express();

// 代理 Socket.io 请求到后端3001端口
app.use('/socket.io', createProxyMiddleware({
  target: 'http://localhost:3001',
  changeOrigin: true,
  ws: true,
  logLevel: 'silent'
}));

// 静态文件服务前端
app.use(express.static(path.join(__dirname, "frontend/build")));

// 所有其他请求返回前端应用
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "frontend/build", "index.html"));
});

const PORT = 8080;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`代理服务器运行在端口 ${PORT}`);
  console.log(`本地访问: http://localhost:${PORT}`);
  console.log(`外网访问: http://0.0.0.0:${PORT}`);
  console.log(`Socket.io通过 /socket.io 路径代理到后端`);
});
