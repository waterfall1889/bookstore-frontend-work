#!/usr/bin/env python3
"""
BookStore MCP Server
提供图书查找功能的MCP服务器，连接到MySQL数据库
"""

import asyncio
import json
import os
import sys
from typing import Any, Sequence
import mysql.connector
from mysql.connector import Error

try:
    from mcp.server import Server
    from mcp.server.stdio import stdio_server
    from mcp.server.models import InitializationOptions
    from mcp.server.lowlevel.server import NotificationOptions
    from mcp.types import Tool, TextContent
except ImportError:
    print("错误: 请先安装MCP库: pip install mcp", file=sys.stderr)
    sys.exit(1)

# 数据库配置（从环境变量或默认值读取）
DB_CONFIG = {
    'host': os.getenv('DB_HOST', 'localhost'),
    'port': int(os.getenv('DB_PORT', '3306')),
    'database': os.getenv('DB_NAME', 'bookstore'),
    'user': os.getenv('DB_USER', 'root'),
    'password': os.getenv('DB_PASSWORD', '20050829zzm'),
    'charset': 'utf8mb4',
    'collation': 'utf8mb4_unicode_ci'
}

# 创建MCP服务器实例
server = Server("bookstore-mcp-server")

def get_db_connection():
    """获取数据库连接"""
    try:
        connection = mysql.connector.connect(**DB_CONFIG)
        return connection
    except Error as e:
        print(f"数据库连接错误: {e}")
        raise

@server.list_tools()
async def list_tools() -> list[Tool]:
    """列出所有可用的工具"""
    return [
        Tool(
            name="search_books",
            description="根据书名、作者、ISBN或出版社搜索图书。支持模糊搜索。",
            inputSchema={
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
        ),
        Tool(
            name="get_book_by_id",
            description="根据图书ID获取详细的图书信息",
            inputSchema={
                "type": "object",
                "properties": {
                    "item_id": {
                        "type": "string",
                        "description": "图书的唯一标识符（item_id）"
                    }
                },
                "required": ["item_id"]
            }
        ),
        Tool(
            name="get_books_by_author",
            description="根据作者名称查找该作者的所有图书",
            inputSchema={
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
        ),
        Tool(
            name="get_available_books",
            description="获取所有有库存的图书列表",
            inputSchema={
                "type": "object",
                "properties": {
                    "limit": {
                        "type": "integer",
                        "description": "返回结果的最大数量，默认20",
                        "default": 20
                    },
                    "min_stock": {
                        "type": "integer",
                        "description": "最小库存数量，默认1",
                        "default": 1
                    }
                }
            }
        )
    ]

@server.call_tool()
async def call_tool(name: str, arguments: dict) -> Sequence[TextContent]:
    """处理工具调用"""
    
    if name == "search_books":
        query = arguments.get("query", "")
        limit = arguments.get("limit", 10)
        
        if not query:
            return [TextContent(
                type="text",
                text="错误: 搜索关键词不能为空"
            )]
        
        try:
            connection = get_db_connection()
            cursor = connection.cursor(dictionary=True)
            
            # 使用LIKE进行模糊搜索
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
                return [TextContent(
                    type="text",
                    text=f"未找到匹配 '{query}' 的图书"
                )]
            
            # 格式化结果
            books_info = []
            for book in results:
                book_str = f"""
书名: {book['item_name']}
作者: {book['author']}
价格: ¥{book['price']}
库存: {book['remain_number']} 本
ISBN: {book['isbn']}
出版社: {book['publish']}
图书ID: {book['item_id']}
"""
                if book['cover_url']:
                    book_str += f"封面: {book['cover_url']}\n"
                books_info.append(book_str)
            
            result_text = f"找到 {len(results)} 本匹配的图书:\n\n" + "\n---\n".join(books_info)
            
            return [TextContent(
                type="text",
                text=result_text
            )]
            
        except Error as e:
            return [TextContent(
                type="text",
                text=f"数据库查询错误: {str(e)}"
            )]
    
    elif name == "get_book_by_id":
        item_id = arguments.get("item_id", "")
        
        if not item_id:
            return [TextContent(
                type="text",
                text="错误: 图书ID不能为空"
            )]
        
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
                return [TextContent(
                    type="text",
                    text=f"未找到ID为 '{item_id}' 的图书"
                )]
            
            book_info = f"""
图书详细信息:
============
书名: {result['item_name']}
作者: {result['author']}
价格: ¥{result['price']}
库存: {result['remain_number']} 本
ISBN: {result['isbn']}
出版社: {result['publish']}
图书ID: {result['item_id']}
状态: {'有效' if result['validness'] == 1 else '无效'}
"""
            if result['cover_url']:
                book_info += f"封面: {result['cover_url']}\n"
            
            return [TextContent(
                type="text",
                text=book_info
            )]
            
        except Error as e:
            return [TextContent(
                type="text",
                text=f"数据库查询错误: {str(e)}"
            )]
    
    elif name == "get_books_by_author":
        author = arguments.get("author", "")
        limit = arguments.get("limit", 20)
        
        if not author:
            return [TextContent(
                type="text",
                text="错误: 作者名称不能为空"
            )]
        
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
                return [TextContent(
                    type="text",
                    text=f"未找到作者 '{author}' 的图书"
                )]
            
            books_info = []
            for book in results:
                book_str = f"""
书名: {book['item_name']}
价格: ¥{book['price']}
库存: {book['remain_number']} 本
ISBN: {book['isbn']}
出版社: {book['publish']}
图书ID: {book['item_id']}
"""
                books_info.append(book_str)
            
            result_text = f"找到作者 '{author}' 的 {len(results)} 本图书:\n\n" + "\n---\n".join(books_info)
            
            return [TextContent(
                type="text",
                text=result_text
            )]
            
        except Error as e:
            return [TextContent(
                type="text",
                text=f"数据库查询错误: {str(e)}"
            )]
    
    elif name == "get_available_books":
        limit = arguments.get("limit", 20)
        min_stock = arguments.get("min_stock", 1)
        
        try:
            connection = get_db_connection()
            cursor = connection.cursor(dictionary=True)
            
            query = """
                SELECT item_id, item_name, author, price, remain_number, 
                       cover_url, isbn, publish
                FROM item_meta
                WHERE validness = 1 AND remain_number >= %s
                ORDER BY remain_number DESC, item_name
                LIMIT %s
            """
            
            cursor.execute(query, (min_stock, limit))
            results = cursor.fetchall()
            
            cursor.close()
            connection.close()
            
            if not results:
                return [TextContent(
                    type="text",
                    text=f"未找到库存数量 >= {min_stock} 的图书"
                )]
            
            books_info = []
            for book in results:
                book_str = f"""
书名: {book['item_name']}
作者: {book['author']}
价格: ¥{book['price']}
库存: {book['remain_number']} 本
ISBN: {book['isbn']}
出版社: {book['publish']}
图书ID: {book['item_id']}
"""
                books_info.append(book_str)
            
            result_text = f"找到 {len(results)} 本有库存的图书 (库存 >= {min_stock}):\n\n" + "\n---\n".join(books_info)
            
            return [TextContent(
                type="text",
                text=result_text
            )]
            
        except Error as e:
            return [TextContent(
                type="text",
                text=f"数据库查询错误: {str(e)}"
            )]
    
    else:
        return [TextContent(
            type="text",
            text=f"未知的工具: {name}"
        )]

async def main():
    """主函数"""
    # 创建通知选项（不使用通知功能）
    notification_opts = NotificationOptions(
        prompts_changed=False,
        resources_changed=False,
        tools_changed=False
    )
    
    # 创建初始化选项
    init_options = InitializationOptions(
        server_name="bookstore-mcp-server",
        server_version="1.0.0",
        capabilities=server.get_capabilities(
            notification_options=notification_opts,
            experimental_capabilities=None
        )
    )
    
    # 使用stdio传输运行服务器
    async with stdio_server() as (read_stream, write_stream):
        await server.run(
            read_stream,
            write_stream,
            init_options
        )

if __name__ == "__main__":
    asyncio.run(main())

