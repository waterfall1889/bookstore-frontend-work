// 标签搜索服务
export async function searchBooksByTag(tagName) {
    console.log('开始按标签搜索图书，标签:', tagName);
    try {
        const response = await fetch(`http://localhost:8080/api/books/searchByTag`, {
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
            throw new Error(errorData.message || '标签搜索失败');
        }

        const data = await response.json();
        console.log('标签搜索成功，返回数据:', data);
        return data;
    } catch (error) {
        console.error('标签搜索过程发生错误:', error);
        throw error;
    }
}

export async function searchBooksByTags(tagNames) {
    console.log('开始按多个标签搜索图书，标签:', tagNames);
    try {
        const response = await fetch(`http://localhost:8080/api/books/searchByTags`, {
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
            throw new Error(errorData.message || '多标签搜索失败');
        }

        const data = await response.json();
        console.log('多标签搜索成功，返回数据:', data);
        return data;
    } catch (error) {
        console.error('多标签搜索过程发生错误:', error);
        throw error;
    }
}

export async function getAllTags() {
    console.log('开始获取所有标签');
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
        console.log('获取标签列表成功，返回数据:', data);
        return data;
    } catch (error) {
        console.error('获取标签列表过程发生错误:', error);
        throw error;
    }
}

