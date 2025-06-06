export async function fetchCart(Id) {
    try{
        const response = await fetch('http://localhost:8080/api/cart/' + Id);
        if (!response.ok)
            throw new Error("加载购物车失败");
        return await response.json();
    }
    catch(error){
        console.error('Error fetching cart:', error);
        throw error;
    }

}
