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

        return {
            name: data.user_name,
            IDNumber: data.id,
            email: data.email,
            role: data.status,
            registeredAt: data.sign_date,
            phoneNumber: data.phone_number,
            description: data.description,
            avatar: data.avatar_url,
        };
    }
    catch (error) {
        console.error('获取用户信息失败:', error);
        throw error;
    }
}