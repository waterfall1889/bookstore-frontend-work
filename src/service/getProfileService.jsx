export async function fetchUserProfile(id) {
    try {
        const response = await fetch('http://localhost:8080/api/profile', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({id}),
        });

        if (!response.ok) {
            throw new Error('无法获取用户信息');
        }

        const data = await response.json();

        // 处理头像URL：如果是MongoDB的URL，转换为完整URL
        let avatarUrl = data.avatar_url;
        if (avatarUrl && avatarUrl.startsWith('/api/avatar/')) {
            avatarUrl = `http://localhost:8080${avatarUrl}`;
        } else if (!avatarUrl || avatarUrl === 'http://localhost:8080/images/default.png') {
            // 如果没有头像或使用默认头像，尝试从MongoDB获取
            avatarUrl = `http://localhost:8080/api/avatar/user/${data.id}`;
        }

        return {
            name: data.user_name,
            IDNumber: data.id,
            email: data.email,
            role: data.status,
            registeredAt: data.sign_date,
            phoneNumber: data.phone_number,
            description: data.description,
            avatar: avatarUrl,
        };
    }
    catch (error) {
        console.error('获取用户信息失败:', error);
        throw error;
    }
}