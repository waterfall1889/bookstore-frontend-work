export async function fetchOrders(userId) {
    try{
        const response = await fetch('http://localhost:8080/api/orders/user/' + userId);
        if (!response.ok)
            throw new Error("加载书籍评论失败");
        return await response.json();
    }
    catch (error) {
        console.error('Error fetching cart:', error);
        throw error;
    }
}