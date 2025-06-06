import React, { useState, useEffect } from 'react';
import { Card, DatePicker, Space, Statistic, Row, Col, message, Spin } from 'antd';
import { fetchUserStatistics } from '../service/ChartService';
import BasicLayout from '../components/layout';
import * as echarts from 'echarts';
import { getUserId } from '../utils/ID-Storage';

const { RangePicker } = DatePicker;

const ChartPage = () => {
    const [loading, setLoading] = useState(false);
    const [statistics, setStatistics] = useState(null);

    useEffect(() => {
        // 初始化图表
        const chartDom = document.getElementById('bookChart');
        const myChart = echarts.init(chartDom);
        
        // 监听窗口大小变化，调整图表大小
        window.addEventListener('resize', () => {
            myChart.resize();
        });

        return () => {
            myChart.dispose();
            window.removeEventListener('resize', () => {
                myChart.resize();
            });
        };
    }, []);

    const handleDateRangeChange = async (dates) => {
        if (!dates || dates.length !== 2) {
            return;
        }

        try {
            setLoading(true);
            const [startDate, endDate] = dates;
            const data = await fetchUserStatistics(
                getUserId(),
                startDate.format('YYYY-MM-DD'),
                endDate.format('YYYY-MM-DD')
            );
            setStatistics(data);
            updateChart(data);
        } catch (error) {
            message.error('获取统计数据失败：' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const updateChart = (data) => {
        const chartDom = document.getElementById('bookChart');
        const myChart = echarts.init(chartDom);

        const option = {
            title: {
                text: '购书统计'
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            legend: {
                data: ['购买数量', '消费金额']
            },
            xAxis: {
                type: 'category',
                data: data.bookStatistics.map(item => item.bookName),
                axisLabel: {
                    interval: 0,
                    rotate: 30
                }
            },
            yAxis: [
                {
                    type: 'value',
                    name: '数量',
                    position: 'left'
                },
                {
                    type: 'value',
                    name: '金额',
                    position: 'right',
                    axisLabel: {
                        formatter: '¥{value}'
                    }
                }
            ],
            series: [
                {
                    name: '购买数量',
                    type: 'bar',
                    data: data.bookStatistics.map(item => item.quantity)
                },
                {
                    name: '消费金额',
                    type: 'line',
                    yAxisIndex: 1,
                    data: data.bookStatistics.map(item => item.totalAmount)
                }
            ]
        };

        myChart.setOption(option);
    };

    return (
        <BasicLayout>
            <div style={{ padding: '24px', maxWidth: 1200, margin: '0 auto' }}>
                <Card title="购书统计" style={{ marginBottom: 24 }}>
                    <Space direction="vertical" size="large" style={{ width: '100%' }}>
                        <RangePicker 
                            onChange={handleDateRangeChange}
                            style={{ width: 300 }}
                        />
                        
                        {loading ? (
                            <div style={{ textAlign: 'center', padding: '50px' }}>
                                <Spin size="large" />
                            </div>
                        ) : statistics && (
                            <>
                                <Row gutter={16}>
                                    <Col span={8}>
                                        <Card>
                                            <Statistic
                                                title="总购书数量"
                                                value={statistics.totalQuantity}
                                                suffix="本"
                                            />
                                        </Card>
                                    </Col>
                                    <Col span={8}>
                                        <Card>
                                            <Statistic
                                                title="总消费金额"
                                                value={statistics.totalAmount}
                                                prefix="¥"
                                                precision={2}
                                            />
                                        </Card>
                                    </Col>
                                    <Col span={8}>
                                        <Card>
                                            <Statistic
                                                title="购买种类"
                                                value={statistics.bookStatistics.length}
                                                suffix="种"
                                            />
                                        </Card>
                                    </Col>
                                </Row>

                                <div 
                                    id="bookChart" 
                                    style={{ 
                                        width: '100%', 
                                        height: '400px',
                                        marginTop: '24px'
                                    }}
                                />
                            </>
                        )}
                    </Space>
                </Card>
            </div>
        </BasicLayout>
    );
};

export default ChartPage; 