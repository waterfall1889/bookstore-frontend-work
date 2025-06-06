export async function removeCartItem(userId, itemId) {
    try {
        const response = await fetch(`http://localhost:8080/api/remove`,
            {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: userId,
                itemId: itemId,
            }),
        });

        if (!response.ok) {
            throw new Error('删除购物车商品失败');
        }

        return await response.json(); // 可选：返回后端响应内容
    } catch (error) {
        console.error('Error removing cart item:', error);
        throw error;
    }
}
