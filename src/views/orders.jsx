import React, { useState, useEffect } from 'react';
import { Typography, Empty, Space, message, Spin } from 'antd';
import BasicLayout from '../components/layout';
import OrderCard from '../components/order_card';
import { fetchOrders } from '../service/OrderInitialService';
import {getUserId} from "../utils/ID-Storage"; // ✅ 路径请改为你的实际文件路径

const { Title } = Typography;

const OrderPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const userId = getUserId();

    useEffect(() => {
        const loadOrders = async () => {
            try {
                const data = await fetchOrders(userId);
                setOrders(data);
            } catch (error) {
                message.error(error.message || '订单加载失败');
            } finally {
                setLoading(false);
            }
        };

        loadOrders();
    }, [userId]);

    const updateOrderStatus = (orderId, newStatus) => {
        setOrders(prev =>
            prev.map(order =>
                order.id === orderId ? { ...order, status: newStatus } : order
            )
        );
        message.success(`订单 ${orderId} 已更新为 ${newStatus}`);
    };

    const handleOrderAction = (actionType, orderId) => {
        if (actionType === 'pay') {
            updateOrderStatus(orderId, '运输中');
        } else if (actionType === 'confirm') {
            updateOrderStatus(orderId, '已完成');
        }
    };

    return (
        <BasicLayout>
            <div style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }}>
                <Space style={{ marginBottom: 32, width: '100%', justifyContent: 'space-between' }}>
                    <Title level={3} style={{ margin: 0 }}>我的订单</Title>
                </Space>

                {loading ? (
                    <Spin size="large" style={{ display: 'block', marginTop: 100 }} />
                ) : orders.length === 0 ? (
                    <Empty
                        description="暂无订单记录"
                        imageStyle={{ height: 120 }}
                        style={{ marginTop: 48 }}
                    />
                ) : (
                    orders.map(order => (
                        <OrderCard
                            key={order.id}
                            order={order}
                            onAction={handleOrderAction}
                        />
                    ))
                )}
            </div>
        </BasicLayout>
    );
};

export default OrderPage;
