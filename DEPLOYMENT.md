# 五子棋在线对战游戏

一个基于 React + Node.js + Socket.io 的在线五子棋游戏。

## 功能特点

- 🎮 实时在线对战
- 🏠 创建房间/加入房间
- ↩️ 悔棋功能
- 🔄 重新开始
- 📱 响应式设计

## 快速开始

### 1. 安装依赖

```bash
# 安装所有依赖（根目录、后端、前端）
npm run install:all
```

### 2. 启动服务

#### 方法一：一键启动（开发环境）
```bash
npm run dev
```

#### 方法二：分别启动（生产环境推荐）
```bash
# 启动后端服务器（端口3001）
npm run start:backend

# 构建前端
npm run build:frontend

# 启动代理服务器（端口8080）
npm start
```

### 3. 访问游戏

打开浏览器访问：http://localhost:8080

## 使用说明

1. **创建房间**：点击"创建房间"按钮，系统会生成一个房间号
2. **分享房间**：将房间号分享给朋友
3. **加入房间**：朋友点击"加入房间"按钮，输入房间号
4. **开始游戏**：两人都进入房间后，游戏自动开始
5. **下棋**：黑棋先手，点击棋盘空位下棋
6. **悔棋**：可以请求悔棋（需要对手同意）
7. **重新开始**：游戏结束后可以重新开始

## 技术栈

- **前端**：React 19, Bootstrap 5, Socket.io Client
- **后端**：Node.js, Express, Socket.io
- **代理**：Express + http-proxy-middleware

## 项目结构

```
gobang-game/
├── backend/          # 后端服务器
│   ├── server.js     # 主服务器
│   ├── gameLogic.js  # 游戏逻辑
│   └── package.json
├── frontend/         # 前端应用
│   ├── src/
│   │   ├── App.js
│   │   └── components/
│   │       └── Board.js
│   ├── public/
│   └── package.json
├── proxy-server.js   # 代理服务器
└── package.json      # 根目录配置
```

## 常见问题

### Q: 无法连接到服务器
A: 确保后端服务器（端口3001）和代理服务器（端口8080）都已启动

### Q: 房间无法加入
A: 检查房间号是否正确，确保房间创建者未离开

### Q: 悔棋功能不工作
A: 悔棋功能需要游戏有历史记录，游戏刚开始或结束后可能无法悔棋

## 部署到服务器

1. 在服务器上安装 Node.js
2. 克隆项目代码
3. 运行 `npm run install:all` 安装依赖
4. 运行 `npm run build:frontend` 构建前端
5. 使用 PM2 或类似工具管理进程：
   ```bash
   pm2 start backend/server.js --name gobang-backend
   pm2 start proxy-server.js --name gobang-proxy
   ```

## 端口说明

- 3001：后端 Socket.io 服务器
- 8080：代理服务器（对外访问端口）

## 许可证

MIT