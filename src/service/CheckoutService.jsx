export async function Checkout(userId) {
    try {
        const response = await fetch(`http://localhost:8080/api/checkout/`+ userId,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: userId,
                }),
            });

        if (!response.ok) {
            throw new Error('结算失败');
        }

        return await response.json();
    }
    catch (error) {
        console.error('Error checkout:', error);
        throw error;
    }
}