import React, { useState, useEffect } from 'react';
import { Card, DatePicker, Input, Space, Button, message, Spin, Table, Tag } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import BasicLayout from '../components/layout';
import { fetchOrders } from '../service/OrderService';
import { searchOrders } from '../service/OrderSearchService';
import { updateOrderStatus } from '../service/updateOrderStatusService';
import { getUserId } from '../utils/ID-Storage';

const { RangePicker } = DatePicker;

const OrderPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchLoading, setSearchLoading] = useState(false);
    const [searchParams, setSearchParams] = useState({
        startDate: null,
        endDate: null,
        bookName: ''
    });

    const calculateTotalAmount = (items) => {
        if (!items || !Array.isArray(items)) return 0;
        return items.reduce((total, item) => {
            const itemTotal = (item.price || 0) * (item.counts || 0);
            return total + itemTotal;
        }, 0);
    };

    const loadOrders = async () => {
        try {
            setLoading(true);
            console.log('开始加载所有订单...');
            const data = await fetchOrders(getUserId());
            console.log('获取到的原始订单数据:', data);
            
            // 按时间降序排序
            const sortedData = data.sort((a, b) => new Date(b.date) - new Date(a.date));
            console.log('排序后的订单数据:', sortedData);
            
            setOrders(sortedData);
            console.log('当前页面订单数量:', sortedData.length);
        } catch (error) {
            console.error('加载订单失败:', error);
            message.error('加载订单失败：' + error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        console.log('OrderPage 组件初始化');
        loadOrders();
    }, []);

    const handleSearch = async () => {
        try {
            setSearchLoading(true);
            const params = {
                userId: getUserId(),
                startDate: searchParams.startDate?.format('YYYY-MM-DD'),
                endDate: searchParams.endDate?.format('YYYY-MM-DD'),
                bookName: searchParams.bookName
            };
            console.log('搜索参数:', params);

            // 如果没有任何搜索条件，则显示所有订单
            if (!params.startDate && !params.endDate && !params.bookName) {
                console.log('无搜索条件，显示所有订单');
                await loadOrders();
                return;
            }

            console.log('开始搜索订单...');
            const data = await searchOrders(params);
            console.log('搜索结果:', data);
            
            // 搜索结果也按时间降序排序
            const sortedData = data.sort((a, b) => new Date(b.date) - new Date(a.date));
            console.log('排序后的搜索结果:', sortedData);
            
            setOrders(sortedData);
            console.log('当前页面订单数量:', sortedData.length);
        } catch (error) {
            console.error('搜索订单失败:', error);
            message.error('搜索订单失败：' + error.message);
        } finally {
            setSearchLoading(false);
        }
    };

    const handleReset = () => {
        console.log('重置搜索条件');
        setSearchParams({
            startDate: null,
            endDate: null,
            bookName: ''
        });
        loadOrders();
    };

    const handleStatusUpdate = async (orderId, newStatus) => {
        try {
            console.log('更新订单状态:', { orderId, newStatus });
            await updateOrderStatus(orderId, newStatus);
            message.success('订单状态更新成功');
            
            // 更新本地订单状态
            setOrders(prevOrders => 
                prevOrders.map(order => 
                    order.orderId === orderId 
                        ? { ...order, status: newStatus }
                        : order
                )
            );
        } catch (error) {
            console.error('更新订单状态失败:', error);
            message.error('更新订单状态失败：' + error.message);
        }
    };

    const getStatusTag = (status) => {
        const statusMap = {
            'FIN': { color: 'green', text: '已完成' },
            'IDL': { color: 'blue', text: '运输中' },
            'WFP': { color: 'orange', text: '待支付' }
        };
        const { color, text } = statusMap[status] || { color: 'default', text: status };
        return <Tag color={color}>{text}</Tag>;
    };

    const getNextStatus = (currentStatus) => {
        const statusFlow = {
            'WFP': 'IDL',
            'IDL': 'FIN'
        };
        return statusFlow[currentStatus];
    };

    const columns = [
        {
            title: '订单编号',
            dataIndex: 'orderId',
            key: 'orderId',
        },
        {
            title: '下单时间',
            dataIndex: 'date',
            key: 'date',
            sorter: (a, b) => new Date(a.date) - new Date(b.date),
            defaultSortOrder: 'descend',
        },
        {
            title: '订单状态',
            dataIndex: 'status',
            key: 'status',
            render: (status) => getStatusTag(status),
        },
        {
            title: '商品信息',
            dataIndex: 'items',
            key: 'items',
            render: (items) => (
                <div>
                    {items?.map((item, index) => (
                        <div key={index}>
                            {item.itemName} x {item.counts} (¥{item.price.toFixed(2)})
                        </div>
                    ))}
                </div>
            ),
        },
        {
            title: '总金额',
            key: 'totalAmount',
            render: (_, record) => {
                const total = calculateTotalAmount(record.items);
                return `¥${total.toFixed(2)}`;
            },
            sorter: (a, b) => calculateTotalAmount(a.items) - calculateTotalAmount(b.items),
        },
        {
            title: '操作',
            key: 'action',
            render: (_, record) => {
                const nextStatus = getNextStatus(record.status);
                if (!nextStatus) return null;
                
                const buttonText = {
                    'WFP': '确认支付',
                    'IDL': '确认收货'
                }[record.status];

                return (
                    <Button 
                        type="primary"
                        onClick={() => handleStatusUpdate(record.orderId, nextStatus)}
                    >
                        {buttonText}
                    </Button>
                );
            }
        }
    ];

    if (loading) {
        return (
            <BasicLayout>
                <div style={{ textAlign: 'center', padding: '50px' }}>
                    <Spin size="large" />
                </div>
            </BasicLayout>
        );
    }

    return (
        <BasicLayout>
            <div style={{ padding: '24px', maxWidth: 1200, margin: '0 auto' }}>
                <Card title="我的订单" style={{ marginBottom: 24 }}>
                    <Space direction="vertical" size="large" style={{ width: '100%' }}>
                        <Space>
                            <RangePicker
                                value={[searchParams.startDate, searchParams.endDate]}
                                onChange={(dates) => setSearchParams(prev => ({
                                    ...prev,
                                    startDate: dates?.[0] || null,
                                    endDate: dates?.[1] || null
                                }))}
                            />
                            <Input
                                placeholder="输入书名搜索"
                                value={searchParams.bookName}
                                onChange={(e) => setSearchParams(prev => ({
                                    ...prev,
                                    bookName: e.target.value
                                }))}
                                style={{ width: 200 }}
                            />
                            <Button
                                type="primary"
                                icon={<SearchOutlined />}
                                onClick={handleSearch}
                                loading={searchLoading}
                            >
                                搜索
                            </Button>
                            <Button onClick={handleReset}>
                                重置
                            </Button>
                        </Space>

                        <Table
                            columns={columns}
                            dataSource={orders}
                            rowKey="orderId"
                            pagination={{
                                pageSize: 10,
                                showTotal: (total) => `共 ${total} 条订单`
                            }}
                        />
                    </Space>
                </Card>
            </div>
        </BasicLayout>
    );
};

export default OrderPage;
