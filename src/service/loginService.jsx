export async function loginRequest(username, password) {
    const requestData = { username, password };

    try {
        const response = await fetch("http://localhost:8080/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestData),
        });

        const data = await response.json();

        if (!data.success) {
            throw new Error("登录失败");
        }

        console.log("登录成功，返回数据:", data);
        return data;
    }
    catch (error) {
        console.error("登录请求失败:", error.message);
        throw error;
    }
}
