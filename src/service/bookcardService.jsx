export async function fetchAllBooks() {
    const response = await fetch('http://localhost:8080/api/books');
    if (!response.ok) throw new Error("加载书籍失败");
    return await response.json();
}

export async function fetchBook(bookId) {
    const response = await fetch('http://localhost:8080/api/books/' + bookId);
    if (!response.ok) throw new Error("加载书籍失败");
    return await response.json();
}