export async function Checkout(userId) {
    try {
        const response = await fetch('http://localhost:8080/api/carts/user/' + userId + '/checkout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: userId,
                items: [] // 后端会根据用户ID获取购物车中的商品
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || '结算失败');
        }

        return await response.json();
    } catch (error) {
        console.error('Error checkout:', error);
        throw error;
    }
}
