/*前后端通信是异步的操作，比如通过 HTTP 请求（fetch、axios）与后端交互，
这些操作不会立即返回结果，而是需要等待网络响应。
使用 async 关键字的目的是为了更好地管理这种异步流程。*/
export async function addToCart(userId, itemId,quantity) {
    try {
        const response = await fetch(`http://localhost:8080/api/cart/add/`+ userId,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',//请求头
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

        return await response.json();
    }
    catch (error) {
        console.error('Error removing cart item:', error);
        throw error;
    }
}
