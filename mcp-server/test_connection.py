#!/usr/bin/env python3
"""
测试数据库连接和MCP服务器基本功能
"""

import os
import sys
import mysql.connector
from mysql.connector import Error

# 数据库配置
DB_CONFIG = {
    'host': os.getenv('DB_HOST', 'localhost'),
    'port': int(os.getenv('DB_PORT', '3306')),
    'database': os.getenv('DB_NAME', 'bookstore'),
    'user': os.getenv('DB_USER', 'root'),
    'password': os.getenv('DB_PASSWORD', '20050829zzm'),
    'charset': 'utf8mb4',
    'collation': 'utf8mb4_unicode_ci'
}

def test_db_connection():
    """测试数据库连接"""
    print("=" * 50)
    print("测试数据库连接...")
    print("=" * 50)
    
    try:
        connection = mysql.connector.connect(**DB_CONFIG)
        if connection.is_connected():
            db_info = connection.get_server_info()
            print(f"✓ 成功连接到MySQL服务器 (版本: {db_info})")
            
            cursor = connection.cursor()
            cursor.execute("SELECT DATABASE();")
            database = cursor.fetchone()
            print(f"✓ 当前数据库: {database[0]}")
            
            # 测试查询item_meta表
            cursor.execute("SELECT COUNT(*) FROM item_meta WHERE validness = 1;")
            count = cursor.fetchone()[0]
            print(f"✓ 有效图书数量: {count} 本")
            
            # 获取一个示例图书
            cursor.execute("""
                SELECT item_id, item_name, author, price 
                FROM item_meta 
                WHERE validness = 1 
                LIMIT 1
            """)
            book = cursor.fetchone()
            if book:
                print(f"✓ 示例图书: {book[1]} (作者: {book[2]}, 价格: ¥{book[3]})")
            
            cursor.close()
            connection.close()
            print("\n✓ 数据库连接测试通过！")
            return True
            
    except Error as e:
        print(f"\n✗ 数据库连接失败: {e}")
        print("\n请检查:")
        print("1. MySQL服务是否运行")
        print("2. 数据库配置是否正确")
        print("3. 数据库 'bookstore' 是否存在")
        print("4. 用户权限是否足够")
        return False

def test_mcp_imports():
    """测试MCP库导入"""
    print("\n" + "=" * 50)
    print("测试MCP库导入...")
    print("=" * 50)
    
    try:
        from mcp.server import Server
        from mcp.server.stdio import stdio_server
        from mcp.types import Tool, TextContent
        print("✓ MCP库导入成功")
        return True
    except ImportError as e:
        print(f"✗ MCP库导入失败: {e}")
        print("\n请运行: pip install -r requirements.txt")
        return False

def main():
    """主测试函数"""
    print("\n" + "=" * 50)
    print("BookStore MCP 服务器 - 连接测试")
    print("=" * 50 + "\n")
    
    # 显示配置信息
    print("当前配置:")
    print(f"  主机: {DB_CONFIG['host']}")
    print(f"  端口: {DB_CONFIG['port']}")
    print(f"  数据库: {DB_CONFIG['database']}")
    print(f"  用户: {DB_CONFIG['user']}")
    print(f"  密码: {'*' * len(DB_CONFIG['password'])}\n")
    
    # 运行测试
    db_ok = test_db_connection()
    mcp_ok = test_mcp_imports()
    
    print("\n" + "=" * 50)
    if db_ok and mcp_ok:
        print("✓ 所有测试通过！MCP服务器可以正常使用。")
        return 0
    else:
        print("✗ 部分测试失败，请检查上述错误信息。")
        return 1

if __name__ == "__main__":
    sys.exit(main())

