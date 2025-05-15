export async function fetchAdvertisement() {
    const response = await fetch('http://localhost:8080/api/advertisements');
    if (!response.ok)
        throw new Error("加载书籍简介失败");
    return await response.json();
}