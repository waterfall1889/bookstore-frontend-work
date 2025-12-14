# 聊天机器人Agent服务

这是一个基于Flask的聊天机器人服务，集成了DeepSeek API和MCP书籍查询工具。

## 功能特性

- 使用DeepSeek API作为大语言模型
- 集成书籍查询工具（搜索、按ID查询、按作者查询）
- 支持对话历史记录
- HTTP RESTful API接口
- 支持跨域请求

## 安装步骤

### 1. 安装Python依赖

```bash
cd chatbot-service
pip install -r requirements.txt
```

### 2. 配置数据库连接（可选）

如果数据库配置与默认不同，可以通过环境变量配置：

```bash
# Windows (PowerShell)
$env:DB_HOST="localhost"
$env:DB_PORT="3306"
$env:DB_NAME="bookstore"
$env:DB_USER="root"
$env:DB_PASSWORD="your_password"

# Linux/Mac
export DB_HOST=localhost
export DB_PORT=3306
export DB_NAME=bookstore
export DB_USER=root
export DB_PASSWORD=your_password
```

### 3. 启动服务

```bash
python chatbot_agent.py
```

服务将在 `http://localhost:5000` 启动。

## API接口

### POST /chat

发送聊天消息。

**请求体：**
```json
{
  "message": "帮我找一本Java相关的书籍",
  "history": [
    {
      "role": "user",
      "content": "你好"
    },
    {
      "role": "assistant",
      "content": "您好！我是书店助手，有什么可以帮您的吗？"
    }
  ]
}
```

**响应：**
```json
{
  "response": "我为您找到了以下Java相关书籍：...",
  "success": true
}
```

### GET /health

健康检查接口。

**响应：**
```json
{
  "status": "healthy"
}
```

## 工具说明

聊天机器人可以使用以下工具：

1. **search_books** - 搜索图书（支持书名、作者、ISBN、出版社）
2. **get_book_by_id** - 根据图书ID获取详细信息
3. **get_books_by_author** - 根据作者查询图书列表

## 使用示例

```bash
# 发送聊天消息
curl -X POST http://localhost:5000/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "帮我找一本关于Python的书籍",
    "history": []
  }'
```

## 注意事项

- 确保MySQL数据库服务正在运行
- 确保数据库中存在`bookstore`数据库和`item_meta`表
- DeepSeek API密钥已配置在代码中
