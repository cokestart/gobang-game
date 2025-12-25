# ⚡ Render 快速部署指南

## 🎯 5分钟快速部署

### 第一步：准备文件
1. 右键点击 `gobang-game` 文件夹
2. 选择 "发送到" → "压缩(zipped)文件夹"
3. 得到 `gobang-game.zip`

### 第二步：注册登录
1. 访问 https://render.com
2. 点击 "Sign Up" 注册
3. 验证邮箱

### 第三步：创建服务
1. 点击 "New +" → "Web Service"
2. 选择 "Manual Deploy"
3. 上传 `gobang-game.zip`
4. 点击 "Create Web Service"

### 第四步：等待部署
等待5-10分钟，看到成功日志。

### 第五步：访问游戏
访问：`https://gobang-game.onrender.com`

## 📋 部署检查清单

### 部署前检查
- [ ] `gobang-game` 文件夹完整
- [ ] 有 `.render.yaml` 文件
- [ ] 有 `render-server.js` 文件
- [ ] 有 `package.json` 文件

### 部署中监控
- [ ] 构建过程无错误
- [ ] 安装依赖成功
- [ ] 前端构建成功
- [ ] 服务启动成功

### 部署后验证
- [ ] 访问 `/health` 返回健康状态
- [ ] 游戏页面正常加载
- [ ] 可以创建房间
- [ ] 可以加入房间

## 🚨 紧急问题解决

### 如果部署失败：
1. **查看日志**：在 Render Dashboard 点击 "Logs"
2. **常见错误**：
   - `npm ERR!` → 依赖安装问题
   - `EADDRINUSE` → 端口冲突
   - `404` → 文件找不到
3. **重新部署**：上传新的 ZIP 文件

### 如果游戏无法访问：
1. 等待30秒（服务可能休眠）
2. 刷新页面
3. 检查控制台错误（F12 → Console）

## 📞 一键命令参考

### 本地测试部署脚本
```bash
cd C:\Users\admin\gobang-game
npm run render:deploy
```

### 创建 ZIP 文件（PowerShell）
```powershell
Compress-Archive -Path "C:\Users\admin\gobang-game\*" -DestinationPath "C:\Users\admin\gobang-game.zip"
```

## 🌐 你的游戏地址
部署成功后，你的游戏地址将是：
```
https://gobang-game.onrender.com
```

或者根据你设置的服务名称：
```
https://[你的服务名称].onrender.com
```

## ⏰ 预计时间
- 注册：2分钟
- 准备文件：1分钟
- 创建服务：2分钟
- 部署等待：5-10分钟
- **总计：10-15分钟**

## 🎮 开始游戏！
1. 打开游戏链接
2. 点击 "创建房间"
3. 分享房间号给朋友
4. 朋友点击 "加入房间"
5. 开始对战！

---

**需要更多帮助？** 查看完整教程：`RENDER-STEP-BY-STEP-TUTORIAL.md`