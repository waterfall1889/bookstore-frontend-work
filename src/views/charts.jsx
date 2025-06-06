import React, { useState } from 'react';
import { Card, DatePicker, Space, Statistic, Row, Col, message, Spin, Table } from 'antd';
import { fetchUserStatistics } from '../service/ChartService';
import BasicLayout from '../components/layout';
import { getUserId } from '../utils/ID-Storage';

const { RangePicker } = DatePicker;

const ChartPage = () => {
    const [loading, setLoading] = useState(false);
    const [statistics, setStatistics] = useState(null);

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
        } catch (error) {
            message.error('获取统计数据失败：' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        {
            title: '书名',
            dataIndex: 'bookName',
            key: 'bookName',
        },
        {
            title: '购买数量',
            dataIndex: 'quantity',
            key: 'quantity',
            sorter: (a, b) => b.quantity - a.quantity,
            render: (text) => `${text}本`,
        },
        {
            title: '消费金额',
            dataIndex: 'totalAmount',
            key: 'totalAmount',
            sorter: (a, b) => b.totalAmount - a.totalAmount,
            render: (text) => `¥${text.toFixed(2)}`,
        }
    ];

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

                                <Table 
                                    columns={columns} 
                                    dataSource={statistics.bookStatistics}
                                    rowKey="bookName"
                                    pagination={false}
                                    style={{ marginTop: 24 }}
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