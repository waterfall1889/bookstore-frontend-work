# MongoDB配置步骤 - 完整指南

## 第一步：启动MongoDB服务

### Windows系统

1. **检查MongoDB服务状态**
   - 按 `Win + R`，输入 `services.msc`，回车
   - 找到 "MongoDB" 服务
   - 如果状态是"已停止"，右键点击 → "启动"

2. **或者使用命令行启动**
   ```cmd
   net start MongoDB
   ```

3. **验证服务是否运行**
   ```cmd
   net start | findstr MongoDB
   ```
   如果看到 "MongoDB" 说明服务已启动

### Mac系统
```bash
brew services start mongodb-community@7.0
```

### Linux系统
```bash
sudo systemctl start mongod
sudo systemctl status mongod
```

---

## 第二步：使用MongoDB Compass连接测试

### 1. 打开MongoDB Compass

### 2. 创建新连接

**连接字符串（URI）**：
```
mongodb://localhost:27017
```

或者直接点击 "Fill in connection fields individually" 填写：
- **Hostname**: `localhost`
- **Port**: `27017`
- **Authentication**: 如果安装时没有设置用户名密码，选择 "None"

### 3. 测试连接

点击 "Connect" 按钮，如果连接成功，你会看到：
- 左侧显示数据库列表
- 可能看到 `admin`、`config`、`local` 等系统数据库

### 4. 创建项目数据库（可选）

虽然MongoDB会在首次使用时自动创建数据库，但也可以手动创建：

1. 在Compass中，点击 "CREATE DATABASE"
2. 填写：
   - **Database Name**: `bookstore`
   - **Collection Name**: `avatars`
3. 点击 "Create Database"

---

## 第三步：验证项目配置

### 1. 检查配置文件

打开 `backend/src/main/resources/application.properties`，确认有以下配置：

```properties
# MongoDB配置
spring.data.mongodb.uri=mongodb://localhost:27017/bookstore
spring.data.mongodb.database=bookstore
```

### 2. 如果MongoDB设置了认证

如果你的MongoDB设置了用户名和密码，需要修改配置：

```properties
# MongoDB配置（带认证）
spring.data.mongodb.uri=mongodb://用户名:密码@localhost:27017/bookstore?authSource=admin
spring.data.mongodb.database=bookstore
```

**注意**：默认安装的MongoDB通常不需要认证，除非你手动设置了。

---

## 第四步：测试连接

### 方法1：使用MongoDB Compass

1. 在Compass中连接到 `localhost:27017`
2. 查看是否有 `bookstore` 数据库
3. 如果没有，不用担心，应用启动时会自动创建

### 方法2：使用命令行（mongosh）

1. 打开命令提示符（CMD）或PowerShell
2. 输入：
   ```cmd
   mongosh
   ```
3. 如果连接成功，你会看到：
   ```
   Current Mongosh Log ID: ...
   Connecting to: mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000
   Using MongoDB: 7.0.x
   Using Mongosh: x.x.x
   ```
4. 测试数据库连接：
   ```javascript
   use bookstore
   db.getName()
   ```
   应该返回 `bookstore`

---

## 第五步：启动项目并验证

### 1. 启动Spring Boot应用

在IDE中启动项目，或者使用Maven：
```cmd
cd backend
mvn spring-boot:run
```

### 2. 查看启动日志

在启动日志中查找MongoDB相关消息，应该看到类似：
```
MongoDB connection established
```

或者如果没有错误，说明连接成功。

### 3. 测试头像上传功能

1. 启动前端应用
2. 登录系统
3. 进入"个人资料" → "修改个人信息"
4. 尝试上传一个头像
5. 在MongoDB Compass中查看：
   - 打开 `bookstore` 数据库
   - 打开 `avatars` 集合
   - 应该能看到刚上传的头像数据

---

## 常见问题排查

### 问题1：无法连接到MongoDB

**错误信息**：`Cannot connect to MongoDB`

**解决方案**：
1. 检查MongoDB服务是否运行
   ```cmd
   net start MongoDB
   ```
2. 检查端口27017是否被占用
   ```cmd
   netstat -ano | findstr :27017
   ```
3. 在MongoDB Compass中测试连接
4. 检查防火墙设置

### 问题2：连接被拒绝

**错误信息**：`Connection refused`

**解决方案**：
1. 确认MongoDB服务正在运行
2. 检查配置文件中的端口是否正确（默认27017）
3. 尝试重启MongoDB服务

### 问题3：认证失败

**错误信息**：`Authentication failed`

**解决方案**：
1. 如果MongoDB没有设置认证，确保配置文件中没有用户名密码
2. 如果设置了认证，确保用户名密码正确
3. 检查 `authSource` 参数是否正确

### 问题4：数据库不存在

**说明**：这是正常的！MongoDB会在首次写入数据时自动创建数据库和集合。

### 问题5：应用启动时MongoDB连接失败

**检查清单**：
- [ ] MongoDB服务是否运行？
- [ ] 端口27017是否被占用？
- [ ] 配置文件中的URI是否正确？
- [ ] 防火墙是否阻止了连接？

---

## 验证配置成功的标志

✅ **MongoDB服务正在运行**
- Windows服务管理器中看到MongoDB服务状态为"正在运行"
- 或命令行 `net start | findstr MongoDB` 显示MongoDB

✅ **MongoDB Compass可以连接**
- 能够连接到 `localhost:27017`
- 可以看到数据库列表

✅ **应用启动无MongoDB错误**
- Spring Boot启动日志中没有MongoDB连接错误
- 应用正常启动

✅ **可以上传头像**
- 在个人资料页面可以上传头像
- 上传后MongoDB Compass中可以看到数据

---

## 快速验证命令

### Windows
```cmd
# 检查MongoDB服务
net start | findstr MongoDB

# 测试连接
mongosh

# 在mongosh中
use bookstore
show collections
```

### 在MongoDB Compass中
1. 连接：`mongodb://localhost:27017`
2. 查看 `bookstore` 数据库
3. 查看 `avatars` 集合（上传头像后会有数据）

---

## 下一步

配置完成后，你可以：
1. 启动项目
2. 测试头像上传功能
3. 在MongoDB Compass中查看上传的头像数据

如果遇到任何问题，请检查：
- MongoDB服务状态
- 连接配置
- 防火墙设置
- 应用启动日志




