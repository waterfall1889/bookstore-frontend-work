// pages/OrderPage.js
import React from 'react';
import BasicLayout from '../components/layout';
import { Typography, Empty, Space } from 'antd';

const { Title } = Typography;

const OrderPage = () => {
    // 暂时没有订单数据
    const orders = [];

    return (
        <BasicLayout>
            <div style={{
                padding: 24,
                maxWidth: 1200,
                margin: '0 auto'
            }}>
                <Space style={{
                    marginBottom: 32,
                    width: '100%',
                    justifyContent: 'space-between'
                }}>
                    <Title level={3} style={{ margin: 0 }}>我的订单</Title>
                </Space>

                {orders.length === 0 ? (
                    <Empty
                        description="暂无订单记录"
                        imageStyle={{ height: 120 }}
                        style={{ marginTop: 48 }}
                    />
                ) : (
                    // 未来如果需要展示订单列表，可在这里添加 OrderCard 组件
                    <></>
                )}
            </div>
        </BasicLayout>
    );
};

export default OrderPage;
