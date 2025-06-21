export async function uploadImage(file, bookId) {
    try {
        const formData = new FormData();
        // 获取文件扩展名
        const ext = file.name.split('.').pop();
        const customFileName = `book${bookId}.${ext}`;
        formData.append('image', file, customFileName);
        formData.append('itemId', bookId);

        const response = await fetch('http://localhost:8080/api/upload/image', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || '图片上传失败');
        }

        // 直接返回拼接的URL
        return `http://localhost:8080/images/${customFileName}`;
    } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
    }
} 