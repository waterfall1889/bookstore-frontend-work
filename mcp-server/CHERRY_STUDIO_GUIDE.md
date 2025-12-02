# Cherry Studio 安装和使用指南

## 一、Cherry Studio 安装方式

### Windows 系统

1. **方法一：官方网站下载**
   - 访问 https://cherry.studio/ 
   - 点击 "Download" 按钮
   - 选择 Windows 版本下载
   - 运行下载的 `.exe` 安装程序
   - 按照安装向导完成安装

2. **方法二：GitHub Releases**
   - 访问 https://github.com/cherry-studio/cherry-studio/releases
   - 下载最新版本的 Windows 安装包
   - 运行安装程序

3. **方法三：使用包管理器（如果已安装）**
   ```powershell
   # 使用 Chocolatey
   choco install cherry-studio
   
   # 或使用 Scoop
   scoop install cherry-studio
   ```

### Mac 系统

1. **官方网站下载**
   - 访问 https://cherry.studio/
   - 下载 macOS 版本（`.dmg` 文件）
   - 打开下载的 `.dmg` 文件
   - 将 Cherry Studio 拖拽到应用程序文件夹

2. **使用 Homebrew**
   ```bash
   brew install --cask cherry-studio
   ```

### Linux 系统

1. **下载 AppImage**
   - 访问 https://cherry.studio/
   - 下载 Linux 版本的 `.AppImage` 文件
   - 赋予执行权限：
     ```bash
     chmod +x Cherry-Studio-*.AppImage
     ```
   - 运行：
     ```bash
     ./Cherry-Studio-*.AppImage
     ```

2. **使用包管理器（如果支持）**
   ```bash
   # Debian/Ubuntu
   sudo apt install cherry-studio
   
   # Fedora
   sudo dnf install cherry-studio
   ```

## 二、配置 BookStore MCP 服务器

### 步骤1: 准备MCP服务器

确保你已经：
- 安装了Python 3.8或更高版本
- 安装了MCP服务器依赖：`pip install -r requirements.txt`
- 确认MySQL数据库正在运行
- 确认数据库连接配置正确

### 步骤2: 找到Cherry Studio配置文件

Cherry Studio的配置文件位置：

- **Windows**: 
  - `%APPDATA%\Cherry Studio\config.json`
  - 或 `C:\Users\<用户名>\AppData\Roaming\Cherry Studio\config.json`
  
- **Mac**: 
  - `~/Library/Application Support/Cherry Studio/config.json`
  
- **Linux**: 
  - `~/.config/cherry-studio/config.json`
  - 或 `~/.cherry-studio/config.json`

### 步骤3: 编辑配置文件

1. 打开配置文件（如果不存在，创建一个新文件）

2. 添加以下配置（根据你的实际情况修改路径）：

**Windows 示例：**
```json
{
  "clientId": "20a291be-c19f-498d-a181-5445b35789d6",
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

**Mac/Linux 示例：**
```json
{
  "mcpServers": {
    "bookstore": {
      "command": "python3",
      "args": [
        "/path/to/bookstore/mcp-server/bookstore_mcp_server.py"
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

**重要提示：**
- 将路径替换为你实际的MCP服务器文件路径
- Windows路径使用双反斜杠 `\\` 或正斜杠 `/`
- 确保Python命令在系统PATH中，或使用完整路径

### 步骤4: 重启Cherry Studio

保存配置文件后，完全关闭并重新启动Cherry Studio。

### 步骤5: 验证连接

1. 打开Cherry Studio
2. 查看设置或状态栏，确认MCP服务器已连接
3. 尝试询问AI助手：
   - "帮我找一本关于Java的书籍"
   - "查找作者张三的所有图书"
   - "告诉我ID为B001的图书信息"

**如何验证MCP是否正确工作？**

详细验证方法请参考 `验证MCP连接.md` 文件。快速验证：

1. **功能测试**：询问"帮我找一本关于Java的书籍"
   - ✅ **正常工作**：AI返回你数据库中实际的图书信息（包含价格、库存等）
   - ❌ **未工作**：AI只能提供通用的书籍推荐

2. **查看状态**：在Cherry Studio的状态栏或设置中查看MCP服务器连接状态

3. **检查进程**：在任务管理器中查看是否有Python进程运行MCP服务器

4. **查看日志**：检查Cherry Studio的日志文件，查找MCP相关信息和错误

## 三、使用对比截图说明

### 不使用MCP服务器时

当没有配置MCP服务器时，AI助手无法直接访问你的数据库，只能：
- 基于训练数据回答一般性问题
- 无法获取你系统中的实际图书信息
- 无法查询库存、价格等实时数据

**示例对话：**
```
用户: 帮我找一本关于Python的书籍
AI: 我可以推荐一些Python相关的经典书籍，比如《Python编程：从入门到实践》...
（AI只能基于通用知识回答，无法访问你的实际数据库）
```

### 使用MCP服务器后

配置MCP服务器后，AI助手可以：
- 直接查询你的MySQL数据库
- 获取实时的图书信息、库存、价格
- 根据书名、作者、ISBN等条件搜索
- 提供准确的、来自你系统的数据

**示例对话：**
```
用户: 帮我找一本关于Python的书籍
AI: [使用search_books工具] 找到了以下Python相关书籍：
书名: Python编程入门
作者: 李四
价格: ¥59.00
库存: 15 本
ISBN: 978-7-123456-78-9
出版社: 科技出版社
图书ID: B005
...
（AI直接从你的数据库查询并返回实际数据）
```

## 四、常见问题

### Q1: 如何确认MCP服务器是否正常工作？

A: 可以手动测试MCP服务器：
```bash
cd mcp-server
python bookstore_mcp_server.py
```
如果服务器正常启动（没有错误输出），说明服务器本身没问题。

### Q2: Cherry Studio显示MCP服务器未连接？

A: 检查以下几点：
1. 配置文件路径和格式是否正确
2. Python命令是否在PATH中
3. 数据库连接配置是否正确
4. 查看Cherry Studio的日志文件（通常在配置目录下）

### Q3: 如何查看MCP服务器的日志？

A: MCP服务器通过stdio通信，错误信息会输出到Cherry Studio的日志中。可以在Cherry Studio的设置中查看日志。

### Q4: 可以配置多个MCP服务器吗？

A: 可以。在配置文件中添加多个服务器配置：
```json
{
  "mcpServers": {
    "bookstore": { ... },
    "other-server": { ... }
  }
}
```

## 五、高级配置

### 使用虚拟环境

如果你使用Python虚拟环境，可以这样配置：

```json
{
  "mcpServers": {
    "bookstore": {
      "command": "D:\\bookstore\\mcp-server\\venv\\Scripts\\python.exe",
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

### 使用环境变量文件

你也可以创建一个 `.env` 文件来管理环境变量，然后在配置中引用。

## 六、截图对比说明

为了展示使用MCP服务器前后的差异，建议进行以下操作并截图：

1. **不使用MCP服务器时**：
   - 打开Cherry Studio（未配置MCP服务器）
   - 询问："帮我找一本关于Java的书籍"
   - 截图显示AI的回复（基于通用知识）

2. **使用MCP服务器后**：
   - 配置MCP服务器并重启Cherry Studio
   - 询问相同的问题："帮我找一本关于Java的书籍"
   - 截图显示AI的回复（从数据库查询的实际数据）

3. **对比说明**：
   - 第一张图：AI只能提供通用建议
   - 第二张图：AI返回你系统中的实际图书信息，包括价格、库存等

这样的对比可以清楚地展示MCP服务器的作用和价值。

