# 🚀 Render 部署教程 - 从零开始部署五子棋游戏

## 📋 教程概述
本教程将详细指导你如何将五子棋游戏部署到 Render 平台。适合第一次使用 Render 的用户。

## 🎯 部署前准备

### 1. 确认项目文件
确保你的 `gobang-game` 文件夹包含以下文件：
```
gobang-game/
├── .render.yaml          # Render 配置文件
├── render-server.js      # 单服务主文件
├── package.json          # 项目配置
├── DEPLOY-RENDER.md      # 部署指南
├── backend/              # 后端代码
└── frontend/             # 前端代码
```

### 2. 检查关键文件
打开命令行，进入项目目录：
```bash
cd C:\Users\admin\gobang-game
```

检查文件是否存在：
```bash
# Windows PowerShell
dir .render.yaml, render-server.js, package.json
```

应该看到：
```
Mode                 LastWriteTime         Length Name
----                 -------------         ------ ----
-a----        2025/12/24     10:30           1234 .render.yaml
-a----        2025/12/24     10:30          15000 render-server.js
-a----        2025/12/24     10:30            800 package.json
```

## 🌐 第一步：注册 Render 账户

### 1. 访问 Render 官网
打开浏览器，访问：https://render.com

### 2. 注册账户
- 点击右上角 "Sign Up"
- 选择注册方式（推荐使用 GitHub 或 Google 账号）
- 填写基本信息完成注册

### 3. 验证邮箱
- 检查邮箱，点击验证链接
- 完成邮箱验证

## 📦 第二步：准备部署文件

### 方法A：使用 ZIP 文件（最简单）

#### 1. 创建 ZIP 文件
1. 在文件资源管理器中，右键点击 `gobang-game` 文件夹
2. 选择 "发送到" → "压缩(zipped)文件夹"
3. 等待压缩完成，得到 `gobang-game.zip`

#### 2. 检查 ZIP 内容
右键点击 `gobang-game.zip` → "属性"，确保大小在 50MB 以内（免费套餐限制）。

### 方法B：使用 GitHub（推荐，自动更新）

#### 1. 创建 GitHub 仓库
1. 访问 https://github.com
2. 点击右上角 "+" → "New repository"
3. 填写仓库信息：
   - Repository name: `gobang-game`
   - Description: "在线五子棋对战游戏"
   - 选择 "Public"（公开）
   - 不勾选 "Initialize this repository with a README"
4. 点击 "Create repository"

#### 2. 上传代码到 GitHub
在命令行中执行：

```bash
# 进入项目目录
cd C:\Users\admin\gobang-game

# 初始化 Git（如果还没有）
git init

# 添加所有文件
git add .

# 提交更改
git commit -m "准备Render部署"

# 添加远程仓库
git remote add origin https://github.com/你的用户名/gobang-game.git

# 推送代码
git branch -M main
git push -u origin main
```

## 🚀 第三步：在 Render 上部署

### 1. 登录 Render
访问 https://dashboard.render.com

### 2. 创建新服务
点击蓝色 "New +" 按钮，选择 "Web Service"

### 3. 连接代码仓库

#### 如果使用 GitHub：
1. 点击 "Connect account" 连接 GitHub
2. 授权 Render 访问你的仓库
3. 在仓库列表中找到 `gobang-game`
4. 点击 "Connect"

#### 如果使用 ZIP：
1. 选择 "Manual Deploy"
2. 点击 "Select Archive"
3. 选择你创建的 `gobang-game.zip` 文件

### 4. 配置服务

Render 会自动检测 `.render.yaml` 文件，显示以下配置：

```
服务名称: gobang-game
环境: Node
地区: Singapore (新加坡)
计划: Free
```

**重要配置检查：**
- ✅ **Name**: `gobang-game`（可以自定义）
- ✅ **Environment**: `Node`
- ✅ **Region**: `Singapore`（亚洲用户访问快）
- ✅ **Plan**: `Free`
- ✅ **Build Command**: 自动从 `.render.yaml` 读取
- ✅ **Start Command**: 自动从 `.render.yaml` 读取

### 5. 环境变量
Render 会自动设置：
- `NODE_ENV=production`
- `PORT=3000`
- `HOST=0.0.0.0`

### 6. 点击 "Create Web Service"
开始部署过程！

## ⏳ 第四步：等待部署完成

### 部署过程时间线：
1. **准备阶段**（1-2分钟）：准备构建环境
2. **安装依赖**（3-5分钟）：执行 `npm install`
3. **构建前端**（2-3分钟）：执行 `npm run render:build`
4. **启动服务**（1分钟）：启动 `render-server.js`
5. **健康检查**（1分钟）：验证服务是否正常运行

### 监控部署进度：
在 Render Dashboard 中，你可以看到：
- **实时日志**：查看构建和启动过程
- **部署状态**：显示当前阶段
- **错误信息**：如果有问题会在这里显示

### 成功标志：
看到以下日志表示部署成功：
```
🎮 五子棋在线对战游戏 - 单服务版本
========================================
服务器运行在: http://0.0.0.0:3000
健康检查: http://0.0.0.0:3000/health
API 信息: http://0.0.0.0:3000/api/info
房间列表: http://0.0.0.0:3000/api/rooms
========================================
```

## 🌐 第五步：访问你的游戏

### 获取访问地址
部署完成后，在服务页面顶部可以看到：
```
https://gobang-game.onrender.com
```

### 测试各个功能

1. **主游戏页面**：
   ```
   https://gobang-game.onrender.com
   ```

2. **健康检查**（验证服务是否正常）：
   ```
   https://gobang-game.onrender.com/health
   ```
   应该返回：`{"status":"healthy","timestamp":"2025-12-24T10:30:00.000Z"}`

3. **API 信息**：
   ```
   https://gobang-game.onrender.com/api/info
   ```

4. **房间列表**：
   ```
   https://gobang-game.onrender.com/api/rooms
   ```

### 测试游戏功能
1. 打开游戏页面
2. 点击 "创建房间"
3. 复制房间号
4. 在另一个浏览器标签页中打开游戏
5. 点击 "加入房间"，输入房间号
6. 开始对战！

## 🔧 第六步：管理和维护

### 1. 查看服务状态
在 Render Dashboard 中：
- **Overview**：服务概览
- **Logs**：实时日志
- **Deploys**：部署历史
- **Settings**：服务设置

### 2. 查看日志
点击 "Logs" 标签，可以看到：
- 实时访问日志
- 错误信息
- 游戏房间创建记录

### 3. 重新部署
如果需要更新代码：
- **GitHub 方式**：推送新代码到 GitHub，Render 会自动重新部署
- **ZIP 方式**：上传新的 ZIP 文件，点击 "Manual Deploy"

### 4. 监控资源使用
免费套餐限制：
- **CPU**：0.1 CPU 核心
- **内存**：512 MB RAM
- **带宽**：100 GB/月
- **运行时间**：750 小时/月（约31天连续运行）

## 🚨 常见问题解决

### 问题1：构建失败
**错误信息**：`npm ERR! Cannot find module`
**解决方法**：
1. 检查 `backend/` 和 `frontend/` 目录是否存在
2. 检查 `package.json` 中的依赖是否正确
3. 查看完整日志定位具体错误

### 问题2：端口冲突
**错误信息**：`EADDRINUSE: address already in use`
**解决方法**：
1. 确保 `.render.yaml` 中的端口是 `3000`
2. Render 会自动设置 `PORT` 环境变量

### 问题3：静态文件404
**错误信息**：前端文件加载失败
**解决方法**：
1. 确保执行了前端构建：`npm run render:build`
2. 检查 `frontend/build/` 目录是否生成
3. 查看构建日志是否有错误

### 问题4：服务自动休眠
**现象**：长时间无访问后，首次访问很慢
**原因**：Render 免费服务在15分钟无活动后会休眠
**解决**：
1. 首次访问需要等待约30秒唤醒
2. 后续访问速度正常
3. 可以使用外部监控服务定期访问保持活跃

### 问题5：WebSocket 连接失败
**现象**：游戏无法实时通信
**解决**：
1. 检查浏览器控制台是否有 WebSocket 错误
2. 确保 Socket.io 配置正确
3. 检查防火墙设置

## 📊 部署成功检查清单

- [ ] Render 账户注册完成
- [ ] 代码上传到 GitHub 或准备好 ZIP
- [ ] 在 Render 创建 Web Service
- [ ] 部署过程无错误
- [ ] 健康检查通过：`/health` 返回正常
- [ ] 游戏主页面可访问
- [ ] 可以创建房间
- [ ] 可以加入房间
- [ ] 可以正常下棋对战

## 🔍 高级功能

### 自定义域名
如果想使用自己的域名：
1. 在服务设置中点击 "Custom Domains"
2. 添加你的域名
3. 按照提示配置 DNS 记录

### 环境变量管理
可以添加自定义环境变量：
1. 进入服务设置
2. 点击 "Environment"
3. 添加新的环境变量

### 自动备份
Render 会自动备份你的服务配置和部署记录。

## 📞 获取帮助

### 1. Render 官方文档
- 文档：https://render.com/docs
- 社区：https://community.render.com

### 2. 查看日志
所有问题都可以在日志中找到线索。

### 3. 联系支持
在 Render Dashboard 右下角有 "Help" 按钮。

## 🎉 恭喜！
你已经成功将五子棋游戏部署到 Render！现在可以分享链接给朋友一起玩了。

**你的游戏地址**：`https://gobang-game.onrender.com`

**分享格式**：
```
🎮 在线五子棋游戏
邀请你来对战！

游戏地址：https://gobang-game.onrender.com

创建房间后分享房间号即可开始游戏！
```

---

## 📝 更新记录
- 2025-12-24：创建详细部署教程
- 包含从注册到部署的完整步骤
- 添加常见问题解决方案

## 📄 相关文件
- `.render.yaml` - Render 配置文件
- `render-server.js` - 单服务主文件
- `DEPLOY-RENDER.md` - 技术部署指南
- `README.md` - 项目说明