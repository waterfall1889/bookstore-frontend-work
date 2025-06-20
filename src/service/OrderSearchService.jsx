export async function searchOrders(params) {
    console.log('开始搜索订单，参数:', params);
    try {
        const response = await fetch('http://localhost:8080/api/orders/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: params.userId,
                startDate: params.startDate,
                endDate: params.endDate,
                bookName: params.bookName
            })
        });

        console.log('收到响应状态:', response.status);
        if (!response.ok) {
            const errorData = await response.json();
            console.error('搜索请求失败:', errorData);
            throw new Error(errorData.message || '搜索订单失败');
        }

        const data = await response.json();
        console.log('搜索成功，返回数据:', data);
        return data;
    } catch (error) {
        console.error('搜索过程发生错误:', error);
        throw error;
    }
}

export async function searchAllOrders(params) {
    console.log('开始搜索订单，参数:', params);
    try {
        const response = await fetch('http://localhost:8080/api/orders/searchAll', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                startDate: params.startDate,
                endDate: params.endDate,
                bookName: params.bookName
            })
        });

        console.log('收到响应状态:', response.status);
        if (!response.ok) {
            const errorData = await response.json();
            console.error('搜索请求失败:', errorData);
            throw new Error(errorData.message || '搜索订单失败');
        }

        const data = await response.json();
        console.log('搜索成功，返回数据:', data);
        return data;
    } catch (error) {
        console.error('搜索过程发生错误:', error);
        throw error;
    }
}