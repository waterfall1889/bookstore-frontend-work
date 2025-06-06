export async function searchBooks(bookName) {
    console.log('开始搜索图书，关键词:', bookName);
    try {
        console.log('发送搜索请求到:', 'http://localhost:8080/api/books/search');
        const response = await fetch(`http://localhost:8080/api/books/search`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                bookName: bookName
            })
        });

        console.log('收到响应状态:', response.status);
        if (!response.ok) {
            const errorData = await response.json();
            console.error('搜索请求失败:', errorData);
            throw new Error(errorData.message || '搜索失败');
        }

        const data = await response.json();
        console.log('搜索成功，返回数据:', data);
        return data;
    } catch (error) {
        console.error('搜索过程发生错误:', error);
        throw error;
    }
} 