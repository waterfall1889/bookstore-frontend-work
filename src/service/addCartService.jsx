export async function addToCart(userId, itemId,quantity) {
    try {
        const response = await fetch(`http://localhost:8080/api/cartAdd/`+ userId,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: userId,
                    itemId: itemId,
                    quantity: quantity,
                }),
            });

        if (!response.ok) {
            throw new Error('增加购物车商品失败');
        }

        return await response.json(); // 可选：返回后端响应内容
    }
    catch (error) {
        console.error('Error removing cart item:', error);
        throw error;
    }
}
