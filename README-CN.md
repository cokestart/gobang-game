# 五子棋在线对战游戏

一个基于 React + Node.js + Socket.io 的在线五子棋对战游戏。

## 功能特点

- 🎮 实时在线对战
- 🏠 房间系统（创建/加入）
- ⚫⚪ 黑白棋对战
- ↩️ 悔棋功能
- 🔄 重新开始
- 📱 响应式设计

## 技术栈

- **前端**: React 19, Bootstrap 5, Socket.io Client
- **后端**: Node.js, Express, Socket.io
- **代理**: Express + http-proxy-middleware

## 快速开始

### 1. 安装依赖

```bash
npm run install:all
```

### 2. 启动游戏

#### Windows 用户
双击运行 `start.bat` 文件，或在命令行中执行：

```bash
start.bat
```

#### 手动启动

1. 启动后端服务器：
```bash
cd backend
npm start
```

2. 启动代理服务器（新窗口）：
```bash
npm start
```

### 3. 访问游戏

打开浏览器访问：http://localhost:8080

## 游戏玩法

1. **创建房间**: 点击"创建房间"按钮，系统会生成一个房间号
2. **加入房间**: 将房间号分享给朋友，朋友点击"加入房间"输入房间号
3. **开始游戏**: 两人加入后游戏自动开始，黑棋先手
4. **下棋**: 点击棋盘空位下棋
5. **悔棋**: 点击"悔棋"按钮可以撤销上一步
6. **重新开始**: 点击"重新开始"按钮重置游戏

## 项目结构

```
gobang-game/
├── backend/           # 后端服务器
│   ├── gameLogic.js   # 游戏逻辑
│   ├── server.js      # 服务器入口
│   └── package.json
├── frontend/          # 前端应用
│   ├── src/
│   │   ├── components/
│   │   │   └── Board.js    # 棋盘组件
│   │   ├── App.js          # 主应用组件
│   │   └── index.js        # 入口文件
│   └── package.json
├── proxy-server.js    # 代理服务器
├── start.bat         # Windows 启动脚本
└── package.json
```

## 开发说明

### 开发模式

```bash
npm run dev
```

这将同时启动后端服务器和代理服务器。

### 构建前端

```bash
npm run build:frontend
```

### 端口说明

- **后端服务器**: 3001
- **代理服务器**: 8080

## 注意事项

- 确保端口 3001 和 8080 未被占用
- 游戏需要两个玩家才能开始
- 房间在玩家断开连接后会自动删除

## 常见问题

### Q: 无法连接到服务器
A: 检查后端服务器是否正常启动，端口是否被占用

### Q: 前端页面无法加载
A: 检查代理服务器是否正常启动，前端是否已构建

### Q: 悔棋功能不工作
A: 悔棋只能在有历史记录时使用，游戏开始后第一步无法悔棋

## License

MIT