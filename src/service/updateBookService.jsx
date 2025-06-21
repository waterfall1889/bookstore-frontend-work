export async function updateBook(bookData) {
    try {
        const response = await fetch('http://localhost:8080/api/updateBooks', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                itemId: bookData.itemId,
                itemName: bookData.itemName,
                price: bookData.price,
                publish: bookData.publish,
                author: bookData.author,
                remainNumber: bookData.remainNumber,
                isbn: bookData.isbn,
                coverUrl: bookData.coverUrl || '',
                description: bookData.description,
                validness: bookData.validness
            })
        });
        console.log('最终请求体', JSON.stringify({
            itemId: bookData.itemId,
            itemName: bookData.itemName,
            price: bookData.price,
            publish: bookData.publish,
            author: bookData.author,
            remainNumber: bookData.remainNumber,
            isbn: bookData.isbn,
            coverUrl: bookData.coverUrl || '',
            description: bookData.description,
            validness: bookData.validness
        }));
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || '修改图书失败');
        }
        return await response.json();
    } catch (error) {
        console.error('Error updating book:', error);
        throw error;
    }
} 