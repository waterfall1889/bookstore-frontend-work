#!/usr/bin/env python3
"""
聊天机器人Agent服务
集成DeepSeek API和MCP书籍查询工具
"""

import os
import json
import requests
import mysql.connector
from flask import Flask, request, jsonify
from flask_cors import CORS
from mysql.connector import Error

app = Flask(__name__)
CORS(app)  # 允许跨域请求

# DeepSeek API配置
DEEPSEEK_API_KEY = "sk-a5bcaa2835eb41c3bd9eed6e8048f081"
DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions"

# 数据库配置（用于直接调用MCP工具）
DB_CONFIG = {
    'host': os.getenv('DB_HOST', 'localhost'),
    'port': int(os.getenv('DB_PORT', '3306')),
    'database': os.getenv('DB_NAME', 'bookstore'),
    'user': os.getenv('DB_USER', 'root'),
    'password': os.getenv('DB_PASSWORD', '20050829zzm'),
    'charset': 'utf8mb4',
    'collation': 'utf8mb4_unicode_ci'
}

def get_db_connection():
    """获取数据库连接"""
    try:
        connection = mysql.connector.connect(**DB_CONFIG)
        return connection
    except Error as e:
        print(f"数据库连接错误: {e}")
        raise

def search_books_tool(query: str, limit: int = 10) -> str:
    """搜索书籍工具函数"""
    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)
        
        search_query = """
            SELECT item_id, item_name, author, price, remain_number, 
                   cover_url, isbn, publish, validness
            FROM item_meta
            WHERE validness = 1
              AND (item_name LIKE %s 
                   OR author LIKE %s 
                   OR isbn LIKE %s 
                   OR publish LIKE %s)
            ORDER BY item_name
            LIMIT %s
        """
        
        search_pattern = f"%{query}%"
        cursor.execute(search_query, (search_pattern, search_pattern, search_pattern, search_pattern, limit))
        results = cursor.fetchall()
        
        cursor.close()
        connection.close()
        
        if not results:
            return f"未找到匹配 '{query}' 的图书"
        
        books_info = []
        for book in results:
            book_str = f"书名: {book['item_name']}, 作者: {book['author']}, 价格: ¥{book['price']}, 库存: {book['remain_number']}本, ISBN: {book['isbn']}, 出版社: {book['publish']}, 图书ID: {book['item_id']}"
            books_info.append(book_str)
        
        return f"找到 {len(results)} 本匹配的图书:\n" + "\n".join(books_info)
        
    except Error as e:
        return f"数据库查询错误: {str(e)}"

def get_book_by_id_tool(item_id: str) -> str:
    """根据ID获取书籍详细信息"""
    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)
        
        query = """
            SELECT item_id, item_name, author, price, remain_number, 
                   cover_url, isbn, publish, validness
            FROM item_meta
            WHERE item_id = %s
        """
        
        cursor.execute(query, (item_id,))
        result = cursor.fetchone()
        
        cursor.close()
        connection.close()
        
        if not result:
            return f"未找到ID为 '{item_id}' 的图书"
        
        return f"图书详细信息: 书名: {result['item_name']}, 作者: {result['author']}, 价格: ¥{result['price']}, 库存: {result['remain_number']}本, ISBN: {result['isbn']}, 出版社: {result['publish']}, 图书ID: {result['item_id']}"
        
    except Error as e:
        return f"数据库查询错误: {str(e)}"

def get_books_by_author_tool(author: str, limit: int = 20) -> str:
    """根据作者获取书籍列表"""
    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)
        
        query = """
            SELECT item_id, item_name, author, price, remain_number, 
                   cover_url, isbn, publish, validness
            FROM item_meta
            WHERE author LIKE %s AND validness = 1
            ORDER BY item_name
            LIMIT %s
        """
        
        author_pattern = f"%{author}%"
        cursor.execute(query, (author_pattern, limit))
        results = cursor.fetchall()
        
        cursor.close()
        connection.close()
        
        if not results:
            return f"未找到作者 '{author}' 的图书"
        
        books_info = []
        for book in results:
            book_str = f"书名: {book['item_name']}, 价格: ¥{book['price']}, 库存: {book['remain_number']}本, ISBN: {book['isbn']}, 出版社: {book['publish']}, 图书ID: {book['item_id']}"
            books_info.append(book_str)
        
        return f"找到作者 '{author}' 的 {len(results)} 本图书:\n" + "\n".join(books_info)
        
    except Error as e:
        return f"数据库查询错误: {str(e)}"

def call_deepseek_api(messages: list, tools: list = None):
    """调用DeepSeek API，返回消息对象或字符串"""
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {DEEPSEEK_API_KEY}"
    }
    
    payload = {
        "model": "deepseek-chat",
        "messages": messages,
        "temperature": 0.7,
        "max_tokens": 2000
    }
    
    if tools:
        payload["tools"] = tools
        payload["tool_choice"] = "auto"  # 让模型自动决定是否使用工具
    
    try:
        response = requests.post(DEEPSEEK_API_URL, headers=headers, json=payload, timeout=30)
        response.raise_for_status()
        result = response.json()
        
        if "choices" in result and len(result["choices"]) > 0:
            message = result["choices"][0]["message"]
            
            # 检查是否有工具调用
            if "tool_calls" in message and message["tool_calls"]:
                return message["tool_calls"]  # 返回工具调用列表
            
            # 返回文本内容
            if "content" in message and message["content"]:
                return message["content"]
            
        return "抱歉，我无法理解您的请求。"
        
    except requests.exceptions.RequestException as e:
        print(f"API调用错误: {e}")
        if hasattr(e, 'response') and e.response is not None:
            try:
                error_detail = e.response.json()
                print(f"API错误详情: {error_detail}")
            except:
                print(f"API响应状态码: {e.response.status_code}")
        return f"API调用失败: {str(e)}"

def get_tools_definition():
    """获取工具定义"""
    return [
        {
            "type": "function",
            "function": {
                "name": "search_books",
                "description": "根据书名、作者、ISBN或出版社搜索图书。支持模糊搜索。",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "query": {
                            "type": "string",
                            "description": "搜索关键词，可以搜索书名、作者、ISBN或出版社"
                        },
                        "limit": {
                            "type": "integer",
                            "description": "返回结果的最大数量，默认10",
                            "default": 10
                        }
                    },
                    "required": ["query"]
                }
            }
        },
        {
            "type": "function",
            "function": {
                "name": "get_book_by_id",
                "description": "根据图书ID获取详细的图书信息",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "item_id": {
                            "type": "string",
                            "description": "图书的唯一标识符（item_id）"
                        }
                    },
                    "required": ["item_id"]
                }
            }
        },
        {
            "type": "function",
            "function": {
                "name": "get_books_by_author",
                "description": "根据作者名称查找该作者的所有图书",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "author": {
                            "type": "string",
                            "description": "作者名称"
                        },
                        "limit": {
                            "type": "integer",
                            "description": "返回结果的最大数量，默认20",
                            "default": 20
                        }
                    },
                    "required": ["author"]
                }
            }
        }
    ]

def execute_tool_call(tool_name: str, arguments: dict) -> str:
    """执行工具调用"""
    if tool_name == "search_books":
        query = arguments.get("query", "")
        limit = arguments.get("limit", 10)
        return search_books_tool(query, limit)
    elif tool_name == "get_book_by_id":
        item_id = arguments.get("item_id", "")
        return get_book_by_id_tool(item_id)
    elif tool_name == "get_books_by_author":
        author = arguments.get("author", "")
        limit = arguments.get("limit", 20)
        return get_books_by_author_tool(author, limit)
    else:
        return f"未知的工具: {tool_name}"

@app.route('/chat', methods=['POST'])
def chat():
    """聊天接口"""
    try:
        data = request.json
        user_message = data.get('message', '')
        conversation_history = data.get('history', [])
        
        if not user_message:
            return jsonify({'error': '消息不能为空'}), 400
        
        # 构建消息历史
        messages = []
        for msg in conversation_history:
            if msg.get('role') in ['user', 'assistant']:
                messages.append({
                    'role': msg['role'],
                    'content': msg['content']
                })
        
        # 添加系统提示
        system_prompt = """你是一个专业的在线书店助手，可以帮助用户搜索和查询图书信息。
当用户询问图书相关信息时，你应该使用提供的工具来查询数据库。
请用友好、专业的语气回答用户的问题。"""
        
        if not any(msg.get('role') == 'system' for msg in messages):
            messages.insert(0, {
                'role': 'system',
                'content': system_prompt
            })
        
        # 添加用户消息
        messages.append({
            'role': 'user',
            'content': user_message
        })
        
        # 获取工具定义
        tools = get_tools_definition()
        
        # 调用DeepSeek API
        result = call_deepseek_api(messages, tools)
        
        # 处理工具调用
        max_iterations = 5  # 防止无限循环
        iteration = 0
        final_response = None
        
        while iteration < max_iterations:
            if isinstance(result, list):  # 工具调用
                # 执行所有工具调用
                tool_results = []
                assistant_message = {
                    "role": "assistant",
                    "content": None,
                    "tool_calls": result
                }
                messages.append(assistant_message)
                
                for tool_call in result:
                    tool_name = tool_call["function"]["name"]
                    try:
                        # 尝试解析JSON字符串
                        if isinstance(tool_call["function"]["arguments"], str):
                            arguments = json.loads(tool_call["function"]["arguments"])
                        else:
                            arguments = tool_call["function"]["arguments"]
                    except (json.JSONDecodeError, TypeError, KeyError) as e:
                        print(f"解析工具参数失败: {e}")
                        arguments = {}
                    
                    tool_result = execute_tool_call(tool_name, arguments)
                    tool_results.append({
                        "role": "tool",
                        "content": tool_result,
                        "tool_call_id": tool_call.get("id", f"call_{iteration}_{len(tool_results)}")
                    })
                
                # 添加工具结果到消息历史
                messages.extend(tool_results)
                
                # 再次调用API获取最终回复
                result = call_deepseek_api(messages, tools)
                iteration += 1
            else:
                # 文本回复，退出循环
                final_response = result
                break
        
        if final_response is None:
            final_response = "抱歉，工具调用处理失败，请稍后再试。"
        
        return jsonify({
            'response': final_response,
            'success': True
        })
        
    except Exception as e:
        print(f"处理聊天请求时发生错误: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({
            'error': f'处理请求时发生错误: {str(e)}',
            'success': False
        }), 500

@app.route('/health', methods=['GET'])
def health():
    """健康检查接口"""
    return jsonify({'status': 'healthy'})

if __name__ == '__main__':
    print("聊天机器人服务启动中...")
    print(f"DeepSeek API URL: {DEEPSEEK_API_URL}")
    print("服务将在 http://localhost:5000 启动")
    app.run(host='0.0.0.0', port=5000, debug=True)
