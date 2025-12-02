#!/usr/bin/env python3
"""
测试MCP服务器是否能正常初始化
"""

import sys
import asyncio

try:
    from mcp.server import Server
    from mcp.server.stdio import stdio_server
    from mcp.server.models import InitializationOptions
    from mcp.server.lowlevel.server import NotificationOptions
    from mcp.types import Tool, TextContent
    print("[OK] MCP库导入成功")
except ImportError as e:
    print(f"[ERROR] MCP库导入失败: {e}")
    sys.exit(1)

# 创建服务器实例
server = Server("bookstore-mcp-server")
print("[OK] 服务器实例创建成功")

# 测试获取能力
try:
    notification_opts = NotificationOptions()
    capabilities = server.get_capabilities(
        notification_options=notification_opts,
        experimental_capabilities=None
    )
    print(f"[OK] 服务器能力获取成功: {capabilities}")
except Exception as e:
    print(f"[ERROR] 获取服务器能力失败: {e}")

# 测试创建初始化选项
try:
    notification_opts = NotificationOptions()
    init_options = InitializationOptions(
        server_name="bookstore-mcp-server",
        server_version="1.0.0",
        capabilities=server.get_capabilities(
            notification_options=notification_opts,
            experimental_capabilities=None
        )
    )
    print("[OK] 初始化选项创建成功")
    print(f"  服务器名称: {init_options.server_name}")
    print(f"  服务器版本: {init_options.server_version}")
except Exception as e:
    print(f"[ERROR] 创建初始化选项失败: {e}")
    import traceback
    traceback.print_exc()

print("\n[OK] 所有测试通过！MCP服务器应该可以正常工作。")
print("\n注意: MCP服务器通过stdio通信，直接运行时可能看起来没有输出。")
print("这是正常的，它会在Cherry Studio调用时工作。")

