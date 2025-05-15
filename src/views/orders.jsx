// pages/OrderPage.js
import React from 'react';
import { useOrder } from '../context/OrderContext';
import BasicLayout from '../components/layout';
import { Typography, Empty, Button, Space } from 'antd';
import OrderCard from '../components/order_card';

const { Title } = Typography;

const OrderPage = () => {
  const { orders, updateOrderStatus, initializeSampleData } = useOrder();

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
            {process.env.NODE_ENV === 'development'}
          </Space>

          {orders.length === 0 ? (
              <Empty
                  description="暂无订单记录"
                  imageStyle={{ height: 120 }}
                  style={{ marginTop: 48 }}
              >
              </Empty>
          ) : (
              orders.map(order => (
                  <OrderCard
                      key={order.id}
                      order={order}
                      onAction={updateOrderStatus}
                  />
              ))
          )}
        </div>
      </BasicLayout>
  );
};

export default OrderPage;