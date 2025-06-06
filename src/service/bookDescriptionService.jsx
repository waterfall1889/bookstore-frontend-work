export async function fetchBookDescription(bookId) {
    try{
        const response = await fetch('http://localhost:8080/api/bookDescription/' + bookId);
        if (!response.ok)
            throw new Error("加载书籍简介失败");
        return await response.json();
    }
    catch (error) {
        console.error(error);
        return error;
    }

}