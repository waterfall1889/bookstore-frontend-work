export async function fetchInitialProfile(Id) {
    const response = await fetch('http://localhost:8080/api/profileInitial/' + Id);
    if (!response.ok)
        throw new Error("加载书籍评论失败");
    return await response.json();
}