/**
 * 聊天机器人服务
 */

const API_BASE_URL = 'http://localhost:8080/api/chatbot';

/**
 * 发送聊天消息
 * @param {string} message - 用户消息
 * @param {Array} history - 对话历史记录
 * @returns {Promise} 返回聊天响应
 */
export async function sendChatMessage(message, history = []) {
    try {
        const response = await fetch(`${API_BASE_URL}/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: message,
                history: history
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || '聊天请求失败');
        }

        if (!data.success) {
            throw new Error(data.message || '聊天服务返回失败');
        }

        return data;
    } catch (error) {
        console.error('发送聊天消息时发生错误:', error);
        throw error;
    }
}

/**
 * 检查聊天服务健康状态
 * @returns {Promise} 返回健康状态
 */
export async function checkChatbotHealth() {
    try {
        const response = await fetch(`${API_BASE_URL}/health`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('检查聊天服务健康状态时发生错误:', error);
        return { status: 'unhealthy', chatbot_service: 'unavailable' };
    }
}
