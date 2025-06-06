export async function fetchBookComment(bookId) {
    try{
        const response = await fetch('http://localhost:8080/api/comments/item/' + bookId);
        if (!response.ok)
            throw new Error("加载书籍评论失败");
        return await response.json();
    }
    catch(error){
        console.error('Error fetching book comment:', error);
        throw error;
    }
}