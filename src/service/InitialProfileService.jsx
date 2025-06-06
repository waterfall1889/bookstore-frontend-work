export async function fetchInitialProfile(Id) {
    try{
        const response = await fetch('http://localhost:8080/api/profileInitial/' + Id);
        if (!response.ok)
            throw new Error("加载个人信息失败");
        return await response.json();
    }
    catch (error) {
        console.error('Error fetching cart:', error);
        throw error;
    }
}