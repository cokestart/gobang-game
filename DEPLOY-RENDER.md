# Render 部署指南 - 单服务版本

## 📋 文件修改说明

本次部署修改了以下文件：

### 1. 新增文件
- `render-server.js` - 单服务版本，合并了后端和代理功能
- `.render.yaml` - Render 部署配置文件
- `DEPLOY-RENDER.md` - 本部署指南

### 2. 修改文件
- `package.json` - 添加了 Render 专用脚本

## 🎯 单服务架构说明

### 原架构（双服务）
```
前端 (3000) ←→ 代理服务器 (8080) ←→ 后端服务器 (3001)
```

### 新架构（单服务）
```
前端 + 后端 + 代理 (3000)
      ↑
    用户
```

### 合并的功能：
1. **后端游戏逻辑**（从 `backend/server.js`）
   - Socket.io 实时通信
   - 房间管理
   - 游戏状态管理

2. **前端静态服务**（从 `proxy-server.js`）
   - 提供 React 构建文件
   - 处理前端路由

3. **API 端点**
   - 健康检查 `/health`
   - 房间信息 `/api/rooms`
   - 服务器信息 `/api/info`

## 🔧 技术细节

### `render-server.js` 关键修改：

```javascript
// 1. 合并 Express 和 Socket.io
const app = express();
const server = http.createServer(app);
const io = socketIo(server);  // 共用同一个 HTTP 服务器

// 2. 静态文件服务
app.use(express.static(path.join(__dirname, 'frontend/build')));

// 3. 前端路由处理
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/build', 'index.html'));
});

// 4. 统一端口
const PORT = process.env.PORT || 3000;
```

### `package.json` 新增脚本：

```json
"scripts": {
  "render:install": "npm install && cd frontend && npm install && cd ../backend && npm install",
  "render:build": "cd frontend && npm run build",
  "render:start": "node render-server.js",
  "render:deploy": "npm run render:install && npm run render:build && npm run render:start"
}
```

## 🚀 部署步骤

### 方法一：使用 ZIP 上传（最简单）

1. **准备文件**
   ```bash
   # 确保有以下文件：
   # - render-server.js
   # - package.json (已修改)
   # - .render.yaml
   # - backend/ 目录
   # - frontend/ 目录
   ```

2. **创建 ZIP**
   - 右键点击 `gobang-game` 文件夹
   - 选择 "发送到" → "压缩(zipped)文件夹"
   - 命名为 `gobang-game.zip`

3. **Render 部署**
   - 访问 https://render.com
   - 注册/登录账户
   - 点击 "New" → "Web Service"
   - 选择 "Manual Deploy"
   - 上传 `gobang-game.zip`
   - 等待部署完成

### 方法二：使用 GitHub（推荐）

1. **推送代码到 GitHub**
   ```bash
   git add .
   git commit -m "添加 Render 单服务部署支持"
   git push origin main
   ```

2. **Render 部署**
   - 访问 https://render.com
   - 点击 "New" → "Web Service"
   - 连接你的 GitHub 仓库
   - Render 会自动检测 `.render.yaml` 配置
   - 点击 "Create Web Service"

## ⚙️ 环境变量

Render 会自动设置以下环境变量：

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `PORT` | `3000` | 服务运行端口 |
| `NODE_ENV` | `production` | 环境模式 |
| `HOST` | `0.0.0.0` | 监听地址 |

## 🩺 健康检查

服务提供健康检查端点：
- `GET /health` - 返回服务器状态
- `GET /api/info` - 返回服务器信息
- `GET /api/rooms` - 返回房间列表

## 🔍 调试技巧

### 查看日志
在 Render Dashboard：
1. 进入你的服务
2. 点击 "Logs" 标签
3. 查看实时日志

### 常见问题

#### 问题1：构建失败
**错误**：`npm ERR! Cannot find module`
**解决**：确保 `backend/` 和 `frontend/` 目录存在

#### 问题2：端口冲突
**错误**：`EADDRINUSE`
**解决**：检查 `.render.yaml` 中的端口配置

#### 问题3：静态文件404
**错误**：前端文件找不到
**解决**：确保执行了 `npm run render:build`

## 📞 支持

如果部署遇到问题：
1. 查看 Render 的构建日志
2. 检查本指南的对应章节
3. 在 GitHub 提交 Issue

## 📄 许可证

MIT