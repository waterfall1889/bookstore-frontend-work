# 聊天机器人Agent架构说明

## 整体流程

```
用户请求 → Spring Boot代理 → Python Flask服务 → DeepSeek API → 工具调用 → MySQL数据库
                                      ↓
                               MCP工具集成
```

## 架构流程详解

### 1. 请求入口层：Spring Boot代理 (`ChatbotController.java`)

**流程：**
- 接收前端POST请求：`/api/chatbot/chat`
- 验证消息内容
- 转发到Python服务：`http://localhost:5000/chat`
- 返回响应给前端

**配置：**
```java
@CrossOrigin(origins = "*")  // 跨域支持
CHATBOT_SERVICE_URL = "http://localhost:5000/chat"  // Python服务地址
```

### 2. Agent服务层：Python Flask (`chatbot_agent.py`)

**核心流程：**

```
接收请求 → 构建消息历史 → 调用DeepSeek API → 判断是否需要工具调用
                                                  ↓
                                          执行MCP工具
                                                  ↓
                                          返回结果给模型
                                                  ↓
                                          生成最终回复
```

**关键配置：**

#### DeepSeek API配置
```python
DEEPSEEK_API_KEY = "sk-a5bcaa2835eb41c3bd9eed6e8048f081"
DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions"
model = "deepseek-chat"
temperature = 0.7
max_tokens = 2000
```

#### 系统提示词
```python
system_prompt = """你是一个专业的在线书店助手，可以帮助用户搜索和查询图书信息。
当用户询问图书相关信息时，你应该使用提供的工具来查询数据库。
请用友好、专业的语气回答用户的问题。"""
```

#### 工具循环处理
- 最大迭代次数：5轮（防止无限循环）
- 工具调用 → 执行工具 → 结果反馈 → 模型生成回复

### 3. MCP工具层：书籍查询工具

**工具定义：**

| 工具名 | 功能 | 参数 |
|--------|------|------|
| `search_books` | 搜索图书 | query(必需), limit(默认10) |
| `get_book_by_id` | 按ID查询 | item_id(必需) |
| `get_books_by_author` | 按作者查询 | author(必需), limit(默认20) |

**工具执行流程：**
```
工具调用 → 解析参数 → 连接MySQL → 执行SQL查询 → 格式化结果 → 返回给模型
```

**数据库配置：**
```python
DB_CONFIG = {
    'host': os.getenv('DB_HOST', 'localhost'),
    'port': int(os.getenv('DB_PORT', '3306')),
    'database': os.getenv('DB_NAME', 'bookstore'),
    'user': os.getenv('DB_USER', 'root'),
    'password': os.getenv('DB_PASSWORD', '20050829zzm'),
    'charset': 'utf8mb4'
}
```

### 4. Function Calling机制

**DeepSeek API工具调用格式：**
```json
{
  "model": "deepseek-chat",
  "messages": [...],
  "tools": [工具定义数组],
  "tool_choice": "auto"
}
```

**工具调用响应处理：**
1. 检查响应中是否包含 `tool_calls`
2. 如果有，提取工具名和参数
3. 执行对应的工具函数
4. 将结果添加到消息历史（role: "tool"）
5. 再次调用API获取最终回复

**消息历史格式：**
```
[
  {"role": "system", "content": "系统提示"},
  {"role": "user", "content": "用户消息"},
  {"role": "assistant", "content": null, "tool_calls": [...]},
  {"role": "tool", "content": "工具结果", "tool_call_id": "..."},
  {"role": "assistant", "content": "最终回复"}
]
```

## 关键节点配置

### 节点1：Spring Boot端口
- **默认：** 8080
- **配置文件：** `application.properties`
- **作用：** 接收前端请求

### 节点2：Python Flask端口
- **默认：** 5000
- **代码位置：** `chatbot_agent.py` 最后一行
- **作用：** Agent服务监听端口

### 节点3：DeepSeek API端点
- **URL：** `https://api.deepseek.com/v1/chat/completions`
- **认证：** Bearer Token（API Key）
- **作用：** 大语言模型推理

### 节点4：MySQL数据库
- **默认端口：** 3306
- **数据库名：** bookstore
- **表：** item_meta
- **作用：** 书籍数据存储

## 数据流转示例

**示例：用户询问"找一本Java书籍"**

1. **前端 → Spring Boot**
   ```json
   POST /api/chatbot/chat
   {"message": "找一本Java书籍", "history": []}
   ```

2. **Spring Boot → Python服务**
   ```json
   POST http://localhost:5000/chat
   {"message": "找一本Java书籍", "history": []}
   ```

3. **Python → DeepSeek API（第一轮）**
   ```json
   {
     "model": "deepseek-chat",
     "messages": [系统提示 + 用户消息],
     "tools": [工具定义]
   }
   ```
   **响应：** 模型决定调用 `search_books` 工具

4. **Python执行工具**
   - 调用 `search_books_tool("Java", 10)`
   - 查询MySQL：`SELECT * FROM item_meta WHERE ... LIKE '%Java%'`
   - 返回格式化结果

5. **Python → DeepSeek API（第二轮）**
   ```json
   {
     "messages": [历史 + 工具结果]
   }
   ```
   **响应：** 模型生成最终回复文本

6. **Python → Spring Boot → 前端**
   ```json
   {"response": "我为您找到了以下Java相关书籍：...", "success": true}
   ```

## 配置要点

1. **环境变量（可选）：** 数据库连接可通过环境变量覆盖
2. **对话历史限制：** 前端只传递最近10条消息（避免token过多）
3. **工具调用限制：** 最多5轮迭代（防止无限循环）
4. **错误处理：** 每层都有错误捕获和日志记录
5. **跨域支持：** Spring Boot和Flask都配置了CORS

## 启动检查清单

- [ ] MySQL服务运行（端口3306）
- [ ] Python依赖已安装（flask, requests, mysql-connector-python）
- [ ] Python服务运行（端口5000）
- [ ] Spring Boot运行（端口8080）
- [ ] DeepSeek API密钥有效
- [ ] 数据库表item_meta存在且有数据
