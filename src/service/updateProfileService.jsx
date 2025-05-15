export async function updateProfileService(userId, profileData) {
    const response = await fetch(`http://localhost:8080/api/UpdateProfile/${userId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(profileData)
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || '服务器返回失败');
    }

    return await response.json(); // 如果你后端返回了 JSON 结果
}
