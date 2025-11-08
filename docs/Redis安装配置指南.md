# Redis Windows安装配置指南

## 一、Redis下载方式

### 方式1：使用官方Windows版本（推荐）

1. **下载地址**：
   - 访问：https://github.com/microsoftarchive/redis/releases
   - 下载最新的 `Redis-x64-*.zip` 文件（例如：Redis-x64-3.0.504.zip）

2. **安装步骤**：
   - 解压下载的zip文件到任意目录（例如：`C:\Redis`）
   - 解压后目录结构如下：
     ```
     Redis/
     ├── redis-server.exe     # Redis服务器
     ├── redis-cli.exe        # Redis命令行客户端
     ├── redis-check-dump.exe
     └── redis-benchmark.exe
     ```

### 方式2：使用WSL（Windows Subsystem for Linux）

如果你安装了WSL，可以在Linux子系统中安装Redis：
```bash
sudo apt update
sudo apt install redis-server
```

### 方式3：使用Docker（推荐用于开发环境）

如果已安装Docker Desktop：
```bash
docker run -d -p 6379:6379 --name redis redis:latest
```

## 二、Redis配置和启动

### Windows直接运行方式：

1. **启动Redis服务器**：
   - 打开命令提示符（cmd）或PowerShell
   - 进入Redis目录（例如：`cd C:\Redis`）
   - 运行：`redis-server.exe`
   - 看到类似以下输出表示启动成功：
     ```
     [12345] 01 Jan 00:00:00.000 * Redis server started
     [12345] 01 Jan 00:00:00.000 * The server is now ready to accept connections on port 6379
     ```

2. **验证Redis是否运行**：
   - 打开另一个命令行窗口
   - 运行：`redis-cli.exe`
   - 输入 `ping`，如果返回 `PONG` 则表示Redis正常运行

3. **设置Redis为Windows服务（可选）**：
   - 使用工具如 `NSSM`（Non-Sucking Service Manager）将Redis设置为Windows服务
   - 下载NSSM：https://nssm.cc/download
   - 安装服务命令：
     ```cmd
     nssm install Redis "C:\Redis\redis-server.exe"
     ```
   - 启动服务：`nssm start Redis`

### Docker方式：

启动后Redis会自动运行，可以通过以下命令连接：
```bash
docker exec -it redis redis-cli
```

## 三、Redis配置修改

### 修改Redis配置文件（可选）

如果需要自定义配置，可以创建 `redis.conf` 文件：

1. **在Redis目录下创建 `redis.conf`**，内容如下：
   ```
   # 绑定地址（0.0.0.0表示允许所有IP连接）
   bind 0.0.0.0
   
   # 端口号
   port 6379
   
   # 密码保护（可选，取消注释并设置密码）
   # requirepass yourpassword
   
   # 持久化配置
   save 900 1
   save 300 10
   save 60 10000
   ```

2. **使用配置文件启动**：
   ```cmd
   redis-server.exe redis.conf
   ```

## 四、测试Redis连接

### 使用redis-cli测试：

```cmd
redis-cli.exe
> ping
PONG
> set test "Hello Redis"
OK
> get test
"Hello Redis"
```

### 停止Redis：

- 如果是在命令行直接运行的，按 `Ctrl+C` 停止
- 如果是Windows服务，运行：`nssm stop Redis`
- 如果是Docker，运行：`docker stop redis`

## 五、常见问题

1. **端口6379被占用**：
   - 检查是否有其他程序占用6379端口
   - 使用命令：`netstat -ano | findstr :6379` 查看占用进程
   - 修改 `redis.conf` 中的 `port` 配置为其他端口

2. **防火墙阻止连接**：
   - 在Windows防火墙中添加Redis的入站规则
   - 允许端口6379的TCP连接

3. **连接拒绝**：
   - 确保Redis服务正在运行
   - 检查绑定地址配置
   - 确保防火墙设置正确

## 六、验证安装成功

安装完成后，你的项目应该能够连接到Redis。在项目启动时会尝试连接Redis，如果连接成功，会在日志中看到相关信息。

