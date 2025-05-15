
export function saveUserId(userId) {
    sessionStorage.setItem('userId', userId);
}

export function getUserId() {
    return sessionStorage.getItem('userId');
}

export function clearUserId() {
    sessionStorage.removeItem('userId');
}