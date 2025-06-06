import React, { useState, useEffect } from 'react';
import { Typography, Empty, Space, message, Spin } from 'antd';
import BasicLayout from '../components/layout';
import OrderCard from '../components/order_card';
import { fetchOrders } from '../service/OrderService';
import { getUserId } from "../utils/ID-Storage";


const { Title } = Typography;

const OrderPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const userId = getUserId();

    const loadOrders = async () => {
        try {
            setLoading(true);
            const data = await fetchOrders(getUserId());
            setOrders(data);
        } catch (error) {
            message.error('获取订单列表失败：' + error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadOrders();
    }, []);

    const handleStatusUpdate = async (orderId, newStatus) => {
        // 更新本地订单状态
        setOrders(prevOrders => 
            prevOrders.map(order => 
                order.orderId === orderId 
                    ? { ...order, status: newStatus }
                    : order
            )
        );
    };

    if (loading) {
        return (
            <BasicLayout>
                <div style={{ textAlign: 'center', padding: '50px' }}>
                    <Spin size="large" />
                </div>
            </BasicLayout>
        );
    }

    if (!orders || orders.length === 0) {
        return (
            <BasicLayout>
                <Empty description="暂无订单" style={{ marginTop: 48 }} />
            </BasicLayout>
        );
    }

    return (
        <BasicLayout>
            <div style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }}>
                <Space style={{ marginBottom: 32, width: '100%', justifyContent: 'space-between' }}>
                    <Title level={3} style={{ margin: 0 }}>我的订单</Title>
                </Space>

                {orders.map(order => (
                    <OrderCard 
                        key={order.orderId} 
                        order={order}
                        onStatusUpdate={handleStatusUpdate}
                    />
                ))}
            </div>
        </BasicLayout>
    );
};

export default OrderPage;
