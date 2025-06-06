export async function fetchAdvertisement() {
    // 1. 添加开始标记
    console.log("[1] 开始请求广告数据");

    try {
        // 2. 打印请求详情
        const url = 'http://localhost:8080/api/advertisements';
        console.log("[2] 请求URL:", url);

        // 3. 发起请求
        const response = await fetch(url);
        console.log("[3] 收到响应，状态码:", response.status);

        // 4. 检查响应状态
        if (!response.ok) {
            const errorBody = await response.text();
            console.error("[4] 响应错误:", errorBody);
            throw new Error(`HTTP ${response.status}`);
        }

        // 5. 解析数据
        const data = await response.json();
        console.log("[5] 收到数据:", data);
        return data;

    } catch (error) {
        // 6. 捕获所有异常
        console.error("[6] 请求失败:", error);

        // 7. 检查是否网络错误
        if (error.name === 'TypeError') {
            console.error("[7] 网络错误，请检查：");
            console.error("- 后端服务是否运行？");
            console.error("- URL是否正确？");
            console.error("- 跨域问题？");
        }

        throw error;
    }
}