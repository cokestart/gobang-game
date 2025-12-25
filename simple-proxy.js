const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const path = require("path");
const fs = require("fs");

const app = express();

// 检查构建目录
const buildPath = path.join(__dirname, "frontend/build");
if (!fs.existsSync(buildPath)) {
  console.error('❌ 错误: frontend/build 目录不存在！');
  console.log('请先构建前端: cd frontend && npm run build');
  process.exit(1);
}

if (!fs.existsSync(path.join(buildPath, "index.html"))) {
  console.error('❌ 错误: frontend/build/index.html 不存在！');
  process.exit(1);
}

console.log('✅ 使用构建文件服务');

// 静态文件服务前端
app.use(express.static(buildPath));

// 代理 Socket.io 连接到后端
app.use(
  "/socket.io",
  createProxyMiddleware({
    target: "http://localhost:3001",
    changeOrigin: true,
    ws: true,
    logLevel: 'silent'
  })
);

// 所有其他请求返回前端应用
app.get("*", (req, res) => {
  res.sendFile(path.join(buildPath, "index.html"));
});

const PORT = 8080;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 代理服务器运行在端口 ${PORT}`);
  console.log(`📱 本地访问: http://localhost:${PORT}`);
  console.log(`🌐 外网访问: http://0.0.0.0:${PORT}`);
  console.log(`📁 服务目录: ${buildPath}`);
});