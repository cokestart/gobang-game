# 五子棋在线对战游戏

一个完整的五子棋游戏，支持双人实时在线对战。

## 技术栈

### 后端
- Node.js
- Express
- Socket.io (WebSocket 实时通信)

### 前端
- React
- Bootstrap 5
- Socket.io Client

## 功能特性

- ✅ 15x15 标准棋盘
- ✅ 双人实时对战
- ✅ 房间创建和加入
- ✅ 自动胜负判定
- ✅ 悔棋功能
- ✅ 重新开始
- ✅ 精美的 UI 设计
- ✅ 响应式布局

## 安装和运行

### 1. 安装依赖

#### 后端
```bash
cd backend
npm install
```

#### 前端
```bash
cd frontend
npm install
```

### 2. 启动应用

#### 启动后端服务器（端口 3001）
```bash
cd backend
npm start
```

#### 启动前端应用（端口 3000）
```bash
cd frontend
npm start
```

### 3. 开始游戏

1. 在浏览器中打开 `http://localhost:3000`
2. 点击"创建房间"创建一个新游戏房间
3. 记下房间号
4. 在另一个浏览器窗口或设备上打开 `http://localhost:3000`
5. 点击"加入房间"并输入房间号
6. 开始对战！

## 游戏规则

- 黑棋先行
- 玩家轮流在棋盘上落子
- 先在横、竖、斜任意方向连成五子者获胜
- 可以使用悔棋功能撤销上一步
- 可以随时重新开始游戏

## 项目结构

```
gobang-game/
├── backend/
│   ├── server.js          # Express + Socket.io 服务器
│   ├── gameLogic.js       # 游戏逻辑（棋盘、胜负判定）
│   └── package.json
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── Board.js   # 棋盘组件
    │   │   └── Board.css
    │   ├── App.js         # 主应用组件
    │   ├── App.css
    │   ├── index.js
    │   └── index.css
    └── package.json
```

## 开发说明

- 后端默认运行在 `http://localhost:3001`
- 前端默认运行在 `http://localhost:3000`
- WebSocket 连接通过 Socket.io 实现
- 支持多个房间同时进行游戏

## 许可证

ISC
