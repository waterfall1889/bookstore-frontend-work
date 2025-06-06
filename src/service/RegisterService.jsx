export async function registerUser(userData) {
    try {
        const response = await fetch('http://localhost:8080/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: userData.username,
                password: userData.password,
                email: userData.email,
                phone: userData.phone,
                description: userData.description || '' // 如果description为空，发送空字符串
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || '注册失败');
        }

        return await response.json();
    } catch (error) {
        console.error('Error registering user:', error);
        throw error;
    }
} 