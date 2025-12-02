# BookStore MCP 服务器

这是一个为BookStore系统提供的MCP (Model Context Protocol) 服务器，允许AI助手通过MCP协议查询MySQL数据库中的图书信息。

## 功能特性

本MCP服务器提供以下工具：

1. **search_books** - 根据书名、作者、ISBN或出版社搜索图书（支持模糊搜索）
2. **get_book_by_id** - 根据图书ID获取详细的图书信息
3. **get_books_by_author** - 根据作者名称查找该作者的所有图书
4. **get_available_books** - 获取所有有库存的图书列表

## 安装步骤

### 1. 安装Python依赖

```bash
cd mcp-server
pip install -r requirements.txt
```

### 2. 配置数据库连接

可以通过环境变量配置数据库连接，或直接修改 `bookstore_mcp_server.py` 中的 `DB_CONFIG`：

```bash
# Windows (CMD)
set DB_HOST=localhost
set DB_PORT=3306
set DB_NAME=bookstore
set DB_USER=root
set DB_PASSWORD=20050829zzm

# Windows (PowerShell)
$env:DB_HOST="localhost"
$env:DB_PORT="3306"
$env:DB_NAME="bookstore"
$env:DB_USER="root"
$env:DB_PASSWORD="20050829zzm"

# Linux/Mac
export DB_HOST=localhost
export DB_PORT=3306
export DB_NAME=bookstore
export DB_USER=root
export DB_PASSWORD=20050829zzm
```

### 3. 测试MCP服务器

```bash
python bookstore_mcp_server.py
```

如果服务器正常启动，应该不会有错误输出（MCP服务器通过stdio通信）。

## 在Cherry Studio中使用

### Cherry Studio安装方式

1. **访问Cherry Studio官网**
   - 访问 https://cherry.studio/ 或搜索 "Cherry Studio"

2. **下载安装**
   - 根据你的操作系统（Windows/Mac/Linux）下载对应版本
   - Windows: 下载 `.exe` 安装包并运行
   - Mac: 下载 `.dmg` 文件并拖拽到应用程序文件夹
   - Linux: 下载 `.AppImage` 或使用包管理器安装

3. **首次启动配置**
   - 打开Cherry Studio
   - 进入设置（Settings）
   - 找到 "MCP Servers" 或 "Extensions" 选项

### 配置MCP服务器

在Cherry Studio中配置MCP服务器：

1. **打开配置文件**
   - Cherry Studio的配置文件通常位于：
     - Windows: `%APPDATA%\Cherry Studio\config.json` 或用户目录下的 `.cherry-studio\config.json`
     - Mac: `~/Library/Application Support/Cherry Studio/config.json`
     - Linux: `~/.config/cherry-studio/config.json`

2. **添加MCP服务器配置**

   在配置文件中添加以下内容（JSON格式）：

```json
{
  "mcpServers": {
    "bookstore": {
      "command": "python",
      "args": [
        "D:\\bookstore\\mcp-server\\bookstore_mcp_server.py"
      ],
      "env": {
        "DB_HOST": "localhost",
        "DB_PORT": "3306",
        "DB_NAME": "bookstore",
        "DB_USER": "root",
        "DB_PASSWORD": "20050829zzm"
      }
    }
  }
}
```

   **注意**: 请将路径 `D:\\bookstore\\mcp-server\\bookstore_mcp_server.py` 替换为你实际的MCP服务器文件路径。

3. **重启Cherry Studio**
   - 保存配置文件后，重启Cherry Studio以使配置生效

4. **验证连接**
   - 在Cherry Studio中，你应该能看到MCP服务器已连接
   - 可以尝试询问AI助手："帮我找一本关于Python的书籍"

## 使用示例

配置完成后，你可以在Cherry Studio中这样使用：

### 示例1: 搜索图书
```
用户: 帮我找一本关于Java的书籍
AI: [使用search_books工具] 找到了以下Java相关书籍...
```

### 示例2: 查询特定图书
```
用户: 告诉我ID为B001的图书详细信息
AI: [使用get_book_by_id工具] 图书详细信息: ...
```

### 示例3: 查找作者的所有图书
```
用户: 查找作者"张三"的所有图书
AI: [使用get_books_by_author工具] 找到作者'张三'的3本图书...
```

## 故障排除

### 问题1: 无法连接到数据库
- 检查MySQL服务是否运行
- 验证数据库连接配置（主机、端口、用户名、密码）
- 确认数据库 `bookstore` 存在且可访问

### 问题2: MCP服务器无法启动
- 确认Python版本 >= 3.8
- 检查所有依赖是否已安装: `pip install -r requirements.txt`
- 查看错误日志以获取详细信息

### 问题3: Cherry Studio无法识别MCP服务器
- 检查配置文件路径是否正确
- 确认Python可执行文件在系统PATH中
- 尝试使用完整路径: `"C:\\Python\\python.exe"`

## 技术细节

- **协议**: MCP (Model Context Protocol)
- **数据库**: MySQL
- **Python版本**: >= 3.8
- **主要依赖**: 
  - `mcp`: MCP协议实现
  - `mysql-connector-python`: MySQL数据库连接器

## 许可证

本项目为BookStore系统的一部分。

