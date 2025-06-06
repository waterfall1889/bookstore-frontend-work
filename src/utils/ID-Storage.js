// 用户ID存储
export const setUserId = (userId) => {
    localStorage.setItem('userId', userId);
};

export const getUserId = () => {
    return localStorage.getItem('userId');
};

export const removeUserId = () => {
    localStorage.removeItem('userId');
};

// 用户角色存储
export const setUserRole = (role) => {
    localStorage.setItem('userRole', role);
};

export const getUserRole = () => {
    return localStorage.getItem('userRole') || 'BASIC';
};

export const removeUserRole = () => {
    localStorage.removeItem('userRole');
};

// 清除所有用户信息
export const clearUserInfo = () => {
    removeUserId();
    removeUserRole();
}; 