export async function logout(userId) {
    try {
        const response = await fetch('http://localhost:8080/api/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || '登出失败');
        }

        console.log('登出成功，返回数据:', data);
        return data;
    } catch (error) {
        console.error('登出过程发生错误:', error);
        throw error;
    }
}