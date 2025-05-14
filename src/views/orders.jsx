import React from 'react';
import { useOrder } from '../context/OrderContext';
import BasicLayout from '../components/layout';
import { Row, Col, Typography, Card, Image, Tag, Empty } from 'antd';

const { Title, Text } = Typography;

const OrderList = () => {
  const { orders } = useOrder();

  if (orders.length === 0) {
    return (
      <BasicLayout>
        <div style={{ padding: '24px' }}>
          <Title level={2}>我的订单</Title>
          <Empty description="暂无订单" />
        </div>
      </BasicLayout>
    );
  }

  return (
    <BasicLayout>
      <div style={{ padding: '24px' }}>
        <Title level={2}>我的订单</Title>
        <Row gutter={[16, 16]}>
          {orders.map((order) => (
            <Col key={order.id} xs={24}>
              <Card>
                <div style={{ marginBottom: '16px' }}>
                  <Text type="secondary">订单时间：{new Date(order.orderTime).toLocaleString()}</Text>
                  <Tag color="blue" style={{ marginLeft: '16px' }}>{order.status}</Tag>
                </div>
                <Row gutter={[16, 16]}>
                  {order.items.map((item) => (
                    <Col key={item.id} xs={24} sm={12} md={8} lg={6}>
                      <Card size="small">
                        <Row align="middle" gutter={8}>
                          <Col span={8}>
                            <Image
                              src={item.cover}
                              alt={item.title}
                              style={{ width: '100%' }}
                              preview={false}
                            />
                          </Col>
                          <Col span={16}>
                            <Text strong>{item.title}</Text>
                            <br />
                            <Text type="secondary">数量：{item.quantity}</Text>
                            <br />
                            <Text type="danger">¥{item.price}</Text>
                          </Col>
                        </Row>
                      </Card>
                    </Col>
                  ))}
                </Row>
                <div style={{ marginTop: '16px', textAlign: 'right' }}>
                  <Text strong>总计：</Text>
                  <Text type="danger" style={{ fontSize: '18px', marginLeft: '8px' }}>
                    ¥{order.totalAmount.toFixed(2)}
                  </Text>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </BasicLayout>
  );
};

export default OrderList;