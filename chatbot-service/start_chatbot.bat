@echo off
echo 启动聊天机器人服务...
echo.
echo 确保已安装Python依赖:
echo pip install -r requirements.txt
echo.
echo 服务将在 http://localhost:5000 启动
echo 按Ctrl+C停止服务
echo.

python chatbot_agent.py

pause
