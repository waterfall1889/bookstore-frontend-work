# MongoDB头像系统快速启动指南

## 快速开始（5分钟）

### 步骤1：安装MongoDB

#### Windows
1. 下载：https://www.mongodb.com/try/download/community
2. 运行安装程序，选择"Complete"安装
3. 选择"Install MongoDB as a Service"
4. 完成安装

#### Mac
```bash
brew tap mongodb/brew
brew install mongodb-community@7.0
brew services start mongodb-community@7.0
```

#### Linux
```bash
# Ubuntu/Debian
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
```

### 步骤2：验证MongoDB运行

打开命令行，执行：
```bash
mongosh
```

如果看到连接成功信息，说明MongoDB已正常运行。

### 步骤3：配置已就绪

项目已配置完成：
- ✅ MongoDB依赖已添加
- ✅ 连接配置已设置（`mongodb://localhost:27017/bookstore`）
- ✅ 代码已实现

### 步骤4：启动应用

1. 确保MongoDB正在运行
2. 启动Spring Boot应用
3. 应用会自动连接到MongoDB

## 功能说明

### 后端功能

1. **头像上传** (`AvatarController`)
   - `POST /api/avatar/upload/{userId}` - 上传头像到MongoDB
   - `GET /api/avatar/{avatarId}` - 根据ID获取头像
   - `GET /api/avatar/user/{userId}` - 根据用户ID获取头像
   - `GET /api/avatar/data/{userId}` - 获取Base64数据URL
   - `DELETE /api/avatar/user/{userId}` - 删除用户头像

2. **头像服务** (`AvatarService`)
   - 文件验证（类型、大小）
   - 自动去激活旧头像
   - Base64编码支持

### 前端功能

1. **个人资料编辑页面** (`profile_editor.jsx`)
   - 显示当前头像
   - 上传新头像按钮
   - 实时预览

2. **头像显示**
   - 自动从MongoDB加载
   - 失败时显示默认图标
   - 支持缓存

## 使用示例

### 上传头像

1. 登录系统
2. 进入"个人资料" → "修改个人信息"
3. 点击"上传头像"按钮
4. 选择图片文件（JPG/PNG/GIF/WebP，最大5MB）
5. 头像自动上传并更新

### 查看头像

头像会在以下位置自动显示：
- 页面顶部导航栏
- 个人资料页面
- 评论区域（如果已实现）

## 测试

### 测试MongoDB连接

```bash
# 连接到MongoDB
mongosh

# 切换到bookstore数据库
use bookstore

# 查看avatars集合
db.avatars.find().pretty()

# 查看特定用户的头像
db.avatars.find({userId: "你的用户ID"})
```

### 测试API

使用Postman或curl测试：

```bash
# 上传头像
curl -X POST http://localhost:8080/api/avatar/upload/用户ID \
  -F "file=@头像图片路径.jpg"

# 获取头像
curl http://localhost:8080/api/avatar/user/用户ID --output avatar.jpg
```

## 常见问题

### Q: MongoDB连接失败？
A: 检查MongoDB服务是否运行，端口27017是否被占用

### Q: 头像上传失败？
A: 检查文件大小（<5MB）和格式（JPG/PNG/GIF/WebP）

### Q: 头像无法显示？
A: 检查浏览器控制台，查看网络请求是否成功

### Q: 如何查看MongoDB中的数据？
A: 使用MongoDB Compass或mongosh命令行工具

## 下一步

- 考虑使用GridFS存储大文件（>16MB）
- 添加头像压缩功能
- 实现头像裁剪功能
- 添加CDN支持

