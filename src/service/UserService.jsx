// 获取用户列表
export const getUserList = async () => {
    try {
        const response = await fetch('http://localhost:8080/api/users', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('获取用户列表失败:', error);
        throw error;
    }
};

// 更新用户状态
export const updateUserStatus = async (userId, status) => {
    try {
        const response = await fetch(`http://localhost:8080/api/users/${userId}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status }),
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('更新用户状态失败:', error);
        throw error;
    }
}; 