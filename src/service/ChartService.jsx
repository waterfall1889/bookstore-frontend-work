import {getUserId} from "../utils/ID-Storage";

export async function fetchUserStatistics(username, startDate, endDate) {
    try {
        console.log('获取统计数据:', { getUserId, startDate, endDate });
        const response = await fetch('http://localhost:8080/api/statistics/user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                getUserId,
                startDate,
                endDate
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || '获取统计数据失败');
        }

        const data = await response.json();
        console.log('收到统计数据:', data);
        return data;
    } catch (error) {
        console.error('获取统计数据出错:', error);
        throw error;
    }
} 