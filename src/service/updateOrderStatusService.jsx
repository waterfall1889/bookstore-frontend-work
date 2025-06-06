export async function updateOrderStatus(orderId, status) {
    try {
        const response = await fetch(`http://localhost:8080/api/orders/${orderId}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || '更新订单状态失败');
        }

        return await response.json();
    } catch (error) {
        console.error('Error updating order status:', error);
        throw error;
    }
} 