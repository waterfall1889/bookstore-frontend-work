#!/bin/bash

echo "========================================"
echo "BookStore MCP 服务器安装脚本"
echo "========================================"
echo ""

echo "[1/3] 检查Python安装..."
if ! command -v python3 &> /dev/null; then
    echo "错误: 未找到Python3，请先安装Python 3.8或更高版本"
    exit 1
fi

python3 --version

echo "[2/3] 安装Python依赖..."
pip3 install -r requirements.txt
if [ $? -ne 0 ]; then
    echo "错误: 依赖安装失败"
    exit 1
fi

echo "[3/3] 安装完成！"
echo ""
echo "下一步:"
echo "1. 配置数据库连接（设置环境变量或修改代码中的DB_CONFIG）"
echo "2. 在Cherry Studio中配置MCP服务器"
echo "3. 参考 README.md 和 CHERRY_STUDIO_GUIDE.md 获取详细说明"
echo ""

