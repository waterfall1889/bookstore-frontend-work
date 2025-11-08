// 订单状态轮询服务
export async function getLatestOrderStatus(userId) {
    try {
        const response = await fetch(`http://localhost:8080/api/orders/user/${userId}/latest`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || '获取订单状态失败');
        }

        return await response.json();
    } catch (error) {
        console.error('获取订单状态失败:', error);
        throw error;
    }
}

// 轮询订单状态，直到订单处理完成或超时
export async function pollOrderStatus(userId, orderId, options = {}) {
    const {
        maxAttempts = 30,        // 最多轮询30次
        interval = 2000,         // 每2秒轮询一次
        onStatusChange = null,   // 状态变化回调
        onComplete = null,       // 完成回调
        onError = null          // 错误回调
    } = options;

    let attempts = 0;
    let lastStatus = null;

    const poll = async () => {
        try {
            attempts++;
            console.log(`第 ${attempts} 次轮询订单状态...`);

            const response = await fetch(`http://localhost:8080/api/orders/${orderId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error('获取订单状态失败');
            }

            const order = await response.json();
            const currentStatus = order.status;

            // 如果状态发生变化，触发回调
            if (currentStatus !== lastStatus) {
                console.log(`订单状态变化: ${lastStatus} -> ${currentStatus}`);
                lastStatus = currentStatus;
                
                if (onStatusChange) {
                    onStatusChange(currentStatus, order);
                }
            }

            // 如果订单已完成处理（不是待支付状态），停止轮询
            if (currentStatus !== 'PENDING' && currentStatus !== 'PROCESSING') {
                console.log('订单处理完成，停止轮询');
                if (onComplete) {
                    onComplete(order);
                }
                return order;
            }

            // 如果还没超过最大尝试次数，继续轮询
            if (attempts < maxAttempts) {
                await new Promise(resolve => setTimeout(resolve, interval));
                return poll();
            } else {
                console.log('达到最大轮询次数，停止轮询');
                if (onComplete) {
                    onComplete(order);
                }
                return order;
            }

        } catch (error) {
            console.error('轮询订单状态出错:', error);
            if (onError) {
                onError(error);
            }
            
            // 如果还没超过最大尝试次数，继续轮询
            if (attempts < maxAttempts) {
                await new Promise(resolve => setTimeout(resolve, interval));
                return poll();
            } else {
                throw error;
            }
        }
    };

    return poll();
}
