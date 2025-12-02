# MongoDB头像存储系统完整指南

## 一、MongoDB安装和配置

### 1. 下载MongoDB

#### Windows系统
1. 访问MongoDB官网：https://www.mongodb.com/try/download/community
2. 选择版本：
   - Version: 7.0（或最新稳定版）
   - Platform: Windows
   - Package: MSI
3. 下载安装程序

#### Mac系统
```bash
# 使用Homebrew安装
brew tap mongodb/brew
brew install mongodb-community@7.0
```

#### Linux系统
```bash
# Ubuntu/Debian
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
```

### 2. 安装MongoDB

#### Windows安装步骤
1. 运行下载的MSI安装程序
2. 选择"Complete"完整安装
3. 选择"Install MongoDB as a Service"
4. 选择"Run service as Network Service user"
5. 取消勾选"Install MongoDB Compass"（可选，图形界面工具）
6. 点击"Install"完成安装

#### 验证安装
打开命令提示符（CMD）或PowerShell：
```bash
mongod --version
mongo --version
```

### 3. 启动MongoDB服务

#### Windows
MongoDB会作为Windows服务自动启动。如果没有启动：
```bash
# 启动MongoDB服务
net start MongoDB

# 停止MongoDB服务
net stop MongoDB
```

#### Mac/Linux
```bash
# 启动MongoDB
brew services start mongodb-community@7.0  # Mac
sudo systemctl start mongod                # Linux

# 停止MongoDB
brew services stop mongodb-community@7.0   # Mac
sudo systemctl stop mongod                 # Linux

# 查看状态
brew services list                         # Mac
sudo systemctl status mongod               # Linux
```

### 4. 验证MongoDB运行

打开新的命令提示符窗口：
```bash
# 连接到MongoDB
mongosh

# 或者使用旧版本命令
mongo
```

如果看到类似以下输出，说明MongoDB运行正常：
```
Current Mongosh Log ID: ...
Connecting to: mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000
Using MongoDB: 7.0.x
Using Mongosh: x.x.x
```

### 5. 创建数据库和集合（可选）

MongoDB会在首次使用时自动创建数据库和集合，但也可以手动创建：

```javascript
// 在mongosh中执行
use bookstore
db.createCollection("avatars")
```

## 二、项目配置

### 1. 依赖已添加

MongoDB依赖已添加到 `pom.xml`：
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-mongodb</artifactId>
</dependency>
```

### 2. 配置文件

在 `application.properties` 中已配置：
```properties
# MongoDB配置
spring.data.mongodb.uri=mongodb://localhost:27017/bookstore
spring.data.mongodb.database=bookstore
```

### 3. 配置说明

- **URI格式**: `mongodb://[用户名:密码@]主机:端口/数据库名`
- **默认配置**: 
  - 主机: localhost
  - 端口: 27017（MongoDB默认端口）
  - 数据库: bookstore

### 4. 如果需要认证

如果MongoDB启用了认证，修改配置：
```properties
spring.data.mongodb.uri=mongodb://用户名:密码@localhost:27017/bookstore?authSource=admin
```

## 三、系统架构

### 1. 数据存储结构

#### MongoDB集合：avatars
```javascript
{
  "_id": "ObjectId",
  "userId": "用户ID",
  "filename": "avatar.jpg",
  "contentType": "image/jpeg",
  "fileSize": 102400,
  "content": "二进制数据",
  "uploadTime": "2025-11-30T19:00:00",
  "isActive": true
}
```

#### MySQL表：users_profile
- `avatar_url` 字段存储MongoDB头像的访问路径：`/api/avatar/{avatarId}`

### 2. 工作流程

1. **上传头像**：
   - 用户选择图片文件
   - 前端调用 `/api/avatar/upload/{userId}`
   - 后端将文件存储到MongoDB
   - 更新MySQL中的avatar_url字段

2. **显示头像**：
   - 前端从MySQL获取avatar_url
   - 如果是MongoDB路径（`/api/avatar/xxx`），调用 `/api/avatar/{avatarId}` 获取图片
   - 显示头像

## 四、API接口

### 1. 上传头像
```http
POST /api/avatar/upload/{userId}
Content-Type: multipart/form-data

file: [图片文件]
```

**响应**:
```json
{
  "message": "头像上传成功",
  "avatarUrl": "/api/avatar/507f1f77bcf86cd799439011",
  "avatarId": "507f1f77bcf86cd799439011"
}
```

### 2. 根据头像ID获取头像
```http
GET /api/avatar/{avatarId}
```

**响应**: 图片二进制数据（Content-Type: image/jpeg等）

### 3. 根据用户ID获取头像
```http
GET /api/avatar/user/{userId}
```

**响应**: 图片二进制数据

### 4. 获取头像Base64数据URL
```http
GET /api/avatar/data/{userId}
```

**响应**:
```json
{
  "avatarUrl": "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
}
```

### 5. 删除用户头像
```http
DELETE /api/avatar/user/{userId}
```

## 五、前端使用

### 1. 上传头像

在个人资料编辑页面：
1. 点击"上传头像"按钮
2. 选择图片文件（支持JPG、PNG、GIF、WebP，最大5MB）
3. 系统自动上传到MongoDB
4. 头像立即更新显示

### 2. 头像显示

系统会自动从MongoDB加载头像：
- 如果用户有头像，显示MongoDB中的头像
- 如果没有头像，显示默认头像图标

## 六、文件限制

- **最大文件大小**: 5MB
- **支持格式**: JPEG, PNG, GIF, WebP
- **文件验证**: 自动验证文件类型和大小

## 七、故障排查

### 1. MongoDB连接失败

**错误**: `Cannot connect to MongoDB`

**解决方案**:
1. 检查MongoDB服务是否运行
   ```bash
   # Windows
   net start MongoDB
   
   # Mac/Linux
   brew services start mongodb-community@7.0
   sudo systemctl start mongod
   ```

2. 检查端口27017是否被占用
   ```bash
   # Windows
   netstat -ano | findstr :27017
   
   # Mac/Linux
   lsof -i :27017
   ```

3. 验证连接配置
   ```bash
   mongosh mongodb://localhost:27017/bookstore
   ```

### 2. 头像上传失败

**错误**: `头像上传失败`

**检查**:
1. 文件大小是否超过5MB
2. 文件格式是否支持
3. MongoDB是否正常运行
4. 查看后端日志获取详细错误信息

### 3. 头像无法显示

**检查**:
1. 头像ID是否正确
2. MongoDB中是否存在该头像
3. 浏览器控制台是否有错误
4. 网络请求是否成功（查看Network标签）

## 八、数据迁移（可选）

如果已有用户使用文件系统存储的头像，可以迁移到MongoDB：

1. 编写迁移脚本，读取文件系统中的头像
2. 上传到MongoDB
3. 更新MySQL中的avatar_url字段

## 九、性能优化建议

1. **使用GridFS**（对于大文件）：
   - 当前实现将文件存储在文档的content字段中
   - 如果文件很大（>16MB），建议使用GridFS

2. **缓存策略**：
   - 头像URL设置了1小时缓存
   - 可以考虑使用Redis缓存热门用户的头像

3. **CDN集成**：
   - 可以将MongoDB中的头像同步到CDN
   - 提高全球访问速度

## 十、安全建议

1. **文件验证**：
   - 已实现文件类型和大小验证
   - 建议添加文件内容验证（检查实际文件类型）

2. **访问控制**：
   - 当前所有用户都可以访问任何头像
   - 可以根据需要添加权限验证

3. **存储限制**：
   - 建议定期清理非激活的头像
   - 限制每个用户的头像数量

