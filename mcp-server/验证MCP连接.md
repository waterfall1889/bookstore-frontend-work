# 如何验证Cherry Studio是否正确使用MCP服务器

## 方法一：查看MCP服务器状态（最直接）

### 1. 检查Cherry Studio的状态栏或设置

在Cherry Studio界面中：

1. **查看状态栏**
   - 通常在窗口底部或顶部
   - 应该显示 "MCP服务器已连接" 或类似提示
   - 可能显示 "bookstore" 服务器状态

2. **查看设置页面**
   - 打开设置（Settings）
   - 找到 "MCP Servers" 或 "Extensions" 选项
   - 应该能看到 "bookstore" 服务器显示为 "已连接" 或 "Connected"

### 2. 查看日志文件

Cherry Studio通常会记录MCP服务器的连接日志：

**Windows:**
```
%APPDATA%\Cherry Studio\logs\
或
C:\Users\<用户名>\AppData\Roaming\Cherry Studio\logs\
```

**Mac:**
```
~/Library/Application Support/Cherry Studio/logs/
```

**Linux:**
```
~/.config/cherry-studio/logs/
```

在日志文件中查找：
- "MCP server connected"
- "bookstore"
- "mcpServers"
- 任何错误信息

## 方法二：功能测试（最可靠）

### 测试1：基础查询测试

在Cherry Studio的对话框中输入：

```
帮我找一本关于Java的书籍
```

**预期结果（如果MCP正常工作）：**
- AI会调用 `search_books` 工具
- 返回你数据库中实际的图书信息
- 包含价格、库存、ISBN等详细信息
- 回复中可能显示使用了工具（取决于Cherry Studio的显示方式）

**如果MCP未工作：**
- AI只能提供通用的书籍推荐
- 无法获取你数据库中的实际数据
- 不会显示工具调用信息

### 测试2：精确ID查询

```
告诉我ID为B001的图书详细信息
```

**预期结果（如果MCP正常工作）：**
- AI会调用 `get_book_by_id` 工具
- 返回该ID对应的具体图书信息
- 如果ID不存在，会明确告知

**如果MCP未工作：**
- AI无法回答，或只能猜测

### 测试3：作者查询

```
查找作者"张三"的所有图书
```

**预期结果（如果MCP正常工作）：**
- AI会调用 `get_books_by_author` 工具
- 返回该作者的所有图书列表

**如果MCP未工作：**
- AI无法获取实际数据

## 方法三：检查进程和连接

### 1. 检查Python进程

**Windows (任务管理器或PowerShell):**
```powershell
Get-Process python | Where-Object {$_.Path -like "*bookstore*"}
```

**Linux/Mac:**
```bash
ps aux | grep bookstore_mcp_server
```

如果MCP服务器正在运行，应该能看到Python进程在执行 `bookstore_mcp_server.py`

### 2. 检查数据库连接

运行测试脚本：
```bash
cd mcp-server
python test_connection.py
```

如果测试通过，说明数据库连接正常，MCP服务器应该也能连接。

## 方法四：查看工具调用（如果Cherry Studio支持）

某些版本的Cherry Studio可能会显示：

1. **工具调用指示器**
   - 在AI回复时显示 "正在使用工具..."
   - 或显示 "使用了 search_books 工具"

2. **调试模式**
   - 如果Cherry Studio有开发者工具或调试模式
   - 可以查看网络请求或工具调用日志

## 方法五：对比测试（最直观）

### 步骤1：禁用MCP服务器测试

1. 临时重命名或注释掉配置文件中的 `mcpServers` 部分
2. 重启Cherry Studio
3. 询问："帮我找一本关于Python的书籍"
4. 截图保存为 `without_mcp.png`
5. 观察AI的回复（应该是通用建议）

### 步骤2：启用MCP服务器测试

1. 恢复配置文件
2. 重启Cherry Studio
3. 询问相同的问题："帮我找一本关于Python的书籍"
4. 截图保存为 `with_mcp.png`
5. 观察AI的回复（应该返回数据库中的实际数据）

### 步骤3：对比

**不使用MCP时：**
```
AI: 我可以为您推荐一些Python相关的经典书籍：
1. 《Python编程：从入门到实践》- 适合初学者
2. 《流畅的Python》- 适合有经验的开发者
...
（基于训练数据的通用回答）
```

**使用MCP后：**
```
AI: [使用search_books工具]

找到了以下Python相关书籍：

书名: Python编程入门
作者: 李四
价格: ¥59.00
库存: 15 本
ISBN: 978-7-123456-78-9
出版社: 科技出版社
图书ID: B005

（从你的数据库查询的实际数据）
```

## 常见问题排查

### 问题1：MCP服务器未启动

**症状：**
- Cherry Studio显示MCP服务器未连接
- 查询时AI无法使用工具

**解决方法：**
1. 检查Python是否在PATH中：`python --version`
2. 检查MCP服务器文件路径是否正确
3. 手动运行MCP服务器测试：
   ```bash
   python D:\bookstore\mcp-server\bookstore_mcp_server.py
   ```
   如果报错，说明代码有问题

### 问题2：配置文件格式错误

**症状：**
- Cherry Studio无法读取配置
- MCP服务器列表为空

**解决方法：**
1. 验证JSON格式（使用在线JSON验证器）
2. 检查路径中的反斜杠是否正确转义
3. 确保所有引号和括号匹配

### 问题3：数据库连接失败

**症状：**
- MCP服务器已连接，但查询失败
- AI回复显示数据库错误

**解决方法：**
1. 运行 `python test_connection.py` 检查数据库连接
2. 确认MySQL服务正在运行
3. 验证数据库配置信息（用户名、密码、数据库名）

### 问题4：权限问题

**症状：**
- Cherry Studio无法执行Python脚本
- 显示权限错误

**解决方法：**
1. 确保Python可执行文件有执行权限
2. 检查文件路径权限
3. Windows: 以管理员身份运行Cherry Studio（如果需要）

## 快速验证清单

使用以下清单快速验证MCP是否正常工作：

- [ ] Cherry Studio状态栏显示MCP服务器已连接
- [ ] 运行 `python test_connection.py` 测试通过
- [ ] 询问"帮我找一本关于Java的书籍"返回数据库中的实际数据
- [ ] 询问"告诉我ID为B001的图书信息"能返回具体信息
- [ ] 任务管理器中能看到Python进程运行MCP服务器
- [ ] 日志文件中没有错误信息

如果以上所有项都通过，说明MCP服务器正常工作！

## 调试技巧

### 启用详细日志

如果Cherry Studio支持，可以启用详细日志模式来查看：
- MCP服务器的启动过程
- 工具调用详情
- 错误信息

### 手动测试MCP服务器

如果怀疑MCP服务器本身有问题，可以：

1. **直接运行服务器：**
   ```bash
   python bookstore_mcp_server.py
   ```
   服务器应该启动并等待输入（通过stdio通信）

2. **使用MCP客户端测试：**
   如果有MCP客户端工具，可以直接测试服务器功能

## 总结

最可靠的验证方法是**功能测试**：
- 如果AI能够返回你数据库中实际的图书信息，说明MCP正常工作
- 如果AI只能提供通用建议，说明MCP未正常工作

结合状态检查、日志查看和功能测试，可以全面确认MCP服务器的连接状态。

