export async function login(username, password) {
    try {
        const response = await fetch('http://localhost:8080/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();  // ✅ 只读一次

        if (!response.ok) {
            throw new Error(data.message || '登录失败');
        }

        console.log('登录成功，返回数据:', data);
        return data;
    } catch (error) {
        console.error('登录过程发生错误:', error);
        throw error;
    }
}
