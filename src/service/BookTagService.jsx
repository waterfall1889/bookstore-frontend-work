// 图书标签管理服务

/**
 * 获取图书的标签
 */
export async function getBookTags(bookId) {
    try {
        const response = await fetch(`http://localhost:8080/api/books/${bookId}/tags`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || '获取图书标签失败');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('获取图书标签失败:', error);
        throw error;
    }
}

/**
 * 为图书添加标签
 */
export async function addTagToBook(bookId, tagName) {
    try {
        const response = await fetch(`http://localhost:8080/api/books/${bookId}/tags`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                tagName: tagName
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || '添加标签失败');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('添加标签失败:', error);
        throw error;
    }
}

/**
 * 为图书批量添加标签
 */
export async function addTagsToBook(bookId, tagNames) {
    try {
        const response = await fetch(`http://localhost:8080/api/books/${bookId}/tags/batch`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                tagNames: tagNames
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || '批量添加标签失败');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('批量添加标签失败:', error);
        throw error;
    }
}

/**
 * 从图书移除标签
 */
export async function removeTagFromBook(bookId, tagName) {
    try {
        const response = await fetch(`http://localhost:8080/api/books/${bookId}/tags/${encodeURIComponent(tagName)}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || '移除标签失败');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('移除标签失败:', error);
        throw error;
    }
}

/**
 * 更新图书的标签（替换所有标签）
 */
export async function updateBookTags(bookId, tagNames) {
    try {
        const response = await fetch(`http://localhost:8080/api/books/${bookId}/tags`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                tagNames: tagNames
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || '更新标签失败');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('更新标签失败:', error);
        throw error;
    }
}

/**
 * 获取所有标签
 */
export async function getAllTags() {
    try {
        const response = await fetch(`http://localhost:8080/api/tags`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || '获取标签列表失败');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('获取标签列表失败:', error);
        throw error;
    }
}

