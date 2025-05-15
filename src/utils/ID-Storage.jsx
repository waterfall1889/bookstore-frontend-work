// 存储用户 ID
export function saveUserId(userId) {
    sessionStorage.setItem('userId', userId);
}

// 获取存储的用户 ID
export function getUserId() {
    return sessionStorage.getItem('userId');
}

// 清除用户 ID
export function clearUserId() {
    sessionStorage.removeItem('userId');
}