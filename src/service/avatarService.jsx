// 头像上传服务

/**
 * 上传用户头像到MongoDB
 */
export async function uploadAvatar(userId, file) {
    try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(`http://localhost:8080/api/avatar/upload/${userId}`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || '头像上传失败');
        }

        const data = await response.json();
        console.log('头像上传成功:', data);
        return data;
    } catch (error) {
        console.error('头像上传失败:', error);
        throw error;
    }
}

/**
 * 获取用户头像的URL
 */
export function getAvatarUrl(userId) {
    return `http://localhost:8080/api/avatar/user/${userId}`;
}

/**
 * 根据头像ID获取头像URL
 */
export function getAvatarUrlById(avatarId) {
    return `http://localhost:8080/api/avatar/${avatarId}`;
}

/**
 * 获取头像的Base64数据URL
 */
export async function getAvatarDataUrl(userId) {
    try {
        const response = await fetch(`http://localhost:8080/api/avatar/data/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error('获取头像失败');
        }

        const data = await response.json();
        return data.avatarUrl;
    } catch (error) {
        console.error('获取头像数据URL失败:', error);
        return null;
    }
}

/**
 * 删除用户头像
 */
export async function deleteAvatar(userId) {
    try {
        const response = await fetch(`http://localhost:8080/api/avatar/user/${userId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || '删除头像失败');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('删除头像失败:', error);
        throw error;
    }
}

