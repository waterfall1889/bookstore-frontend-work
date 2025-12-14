# 聊天机器人Agent架构说明

## 整体流程

```
前端 → Spring Boot(8080) → Python Flask(5000) → DeepSeek API → MCP工具 → MySQL(3306)
```

## 三层架构

### 1. Spring Boot代理层
- **接口：** `POST /api/chatbot/chat`
- **配置：** `@CrossOrigin(origins = "*")`
- **作用：** 转发请求到Python服务

### 2. Python Flask Agent服务
- **端口：** 5000
- **DeepSeek API：**
  - URL: `https://api.deepseek.com/v1/chat/completions`
  - API Key: `sk-a5bcaa2835eb41c3bd9eed6e8048f081`
  - Model: `deepseek-chat`
- **工具循环：** 最多5轮（工具调用 → 执行 → 反馈 → 生成回复）

### 3. MCP工具层
- **工具：** `search_books`、`get_book_by_id`、`get_books_by_author`
- **数据库：** MySQL (localhost:3306, bookstore.item_meta)
- **配置：** 支持环境变量覆盖

## Function Calling流程

1. 用户消息 → 构建消息历史 → 调用DeepSeek API
2. 模型判断 → 如需工具调用 → 执行MCP工具 → 查询MySQL
3. 工具结果 → 反馈给模型 → 生成最终回复

## 关键配置

| 节点 | 配置项 | 默认值 |
|------|--------|--------|
| Spring Boot | 端口 | 8080 |
| Python Flask | 端口 | 5000 |
| MySQL | 端口 | 3306 |
| MySQL | 数据库 | bookstore |
| 工具迭代 | 最大轮数 | 5轮 |
| 对话历史 | 消息数量 | 最近10条 |

## 启动检查

- MySQL运行（3306）
- Python依赖安装（flask, requests, mysql-connector-python）
- Python服务运行（5000）
- Spring Boot运行（8080）
- DeepSeek API密钥有效
