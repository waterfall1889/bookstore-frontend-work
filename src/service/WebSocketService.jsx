/**
 * WebSocket 服务
 * 用于建立和管理与后端的WebSocket连接
 */

class WebSocketService {
    constructor() {
        this.ws = null;
        this.userId = null;
        this.messageHandlers = new Map();
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.reconnectDelay = 3000; // 3秒
        this.isManualClose = false;
        this.heartbeatInterval = null;
    }

    /**
     * 连接WebSocket
     * @param {string} userId - 用户ID
     * @returns {Promise<void>}
     */
    connect(userId) {
        return new Promise((resolve, reject) => {
            if (this.ws && this.ws.readyState === WebSocket.OPEN) {
                console.log('WebSocket已连接');
                resolve();
                return;
            }

            this.userId = userId;
            this.isManualClose = false;

            // 构建WebSocket URL
            const wsUrl = `ws://localhost:8080/ws/order?userId=${userId}`;
            console.log('正在连接WebSocket:', wsUrl);

            try {
                this.ws = new WebSocket(wsUrl);

                // 连接成功
                this.ws.onopen = (event) => {
                    console.log('WebSocket连接成功', event);
                    this.reconnectAttempts = 0;
                    this.startHeartbeat();
                    resolve();
                };

                // 接收消息
                this.ws.onmessage = (event) => {
                    try {
                        const data = JSON.parse(event.data);
                        console.log('收到WebSocket消息:', data);
                        this.handleMessage(data);
                    } catch (error) {
                        console.error('解析WebSocket消息失败:', error);
                    }
                };

                // 连接错误
                this.ws.onerror = (error) => {
                    console.error('WebSocket错误:', error);
                    reject(error);
                };

                // 连接关闭
                this.ws.onclose = (event) => {
                    console.log('WebSocket连接关闭:', event.code, event.reason);
                    this.stopHeartbeat();

                    // 如果不是手动关闭，则尝试重连
                    if (!this.isManualClose && this.reconnectAttempts < this.maxReconnectAttempts) {
                        this.reconnectAttempts++;
                        console.log(`尝试重连 (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
                        setTimeout(() => {
                            this.connect(this.userId);
                        }, this.reconnectDelay);
                    }
                };

            } catch (error) {
                console.error('创建WebSocket连接失败:', error);
                reject(error);
            }
        });
    }

    /**
     * 断开WebSocket连接
     */
    disconnect() {
        this.isManualClose = true;
        this.stopHeartbeat();
        
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
        
        this.messageHandlers.clear();
        console.log('WebSocket已断开');
    }

    /**
     * 发送消息
     * @param {object} message - 要发送的消息对象
     */
    send(message) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(message));
            console.log('发送WebSocket消息:', message);
        } else {
            console.warn('WebSocket未连接，无法发送消息');
        }
    }

    /**
     * 处理接收到的消息
     * @param {object} data - 消息数据
     */
    handleMessage(data) {
        const { type, message, timestamp, data: messageData } = data;

        // 根据消息类型调用对应的处理器
        const handler = this.messageHandlers.get(type);
        if (handler) {
            handler(messageData, message, timestamp);
        } else {
            console.log('未处理的消息类型:', type, data);
        }
    }

    /**
     * 注册消息处理器
     * @param {string} type - 消息类型
     * @param {function} handler - 处理函数
     */
    on(type, handler) {
        this.messageHandlers.set(type, handler);
        console.log('注册消息处理器:', type);
    }

    /**
     * 取消消息处理器
     * @param {string} type - 消息类型
     */
    off(type) {
        this.messageHandlers.delete(type);
        console.log('取消消息处理器:', type);
    }

    /**
     * 启动心跳检测
     */
    startHeartbeat() {
        this.stopHeartbeat();
        this.heartbeatInterval = setInterval(() => {
            if (this.ws && this.ws.readyState === WebSocket.OPEN) {
                this.send({ type: 'ping' });
            }
        }, 30000); // 每30秒发送一次心跳
    }

    /**
     * 停止心跳检测
     */
    stopHeartbeat() {
        if (this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
            this.heartbeatInterval = null;
        }
    }

    /**
     * 检查连接状态
     * @returns {boolean}
     */
    isConnected() {
        return this.ws && this.ws.readyState === WebSocket.OPEN;
    }

    /**
     * 获取连接状态
     * @returns {string}
     */
    getState() {
        if (!this.ws) return 'CLOSED';
        
        switch (this.ws.readyState) {
            case WebSocket.CONNECTING:
                return 'CONNECTING';
            case WebSocket.OPEN:
                return 'OPEN';
            case WebSocket.CLOSING:
                return 'CLOSING';
            case WebSocket.CLOSED:
                return 'CLOSED';
            default:
                return 'UNKNOWN';
        }
    }
}

// 创建单例
const webSocketService = new WebSocketService();

export default webSocketService;

