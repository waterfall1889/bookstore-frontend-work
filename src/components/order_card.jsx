import React from 'react';
import { Card, Row, Col, Typography, Image } from 'antd';

const { Text, Title } = Typography;

const OrderCard = ({ order }) => {
    const totalAmount = order.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    return (
        <Card style={{ marginBottom: 24, borderRadius: 8 }}>
            <Row justify="space-between" align="middle">
                <Col>
                    <Text type="secondary">订单号：{order.order_id}</Text>
                </Col>
            </Row>

            <Row style={{ marginTop: 16, marginBottom: 16 }}>
                <Col span={24}>
                    <Text type="secondary">下单时间：{order.date}</Text>
                </Col>
            </Row>

            <Title level={5} style={{ marginBottom: 16 }}>商品信息</Title>
            {order.items.map(item => (
                <Card key={item.id} size="small" style={{ marginBottom: 12, backgroundColor: '#fafafa' }}>
                    <Row align="middle" gutter={16}>
                        <Col span={4}>
                            <Image
                                src={item.cover_url}
                                alt={item.itemName}
                                preview={false}
                                style={{
                                    width: '100%',
                                    borderRadius: 4,
                                    aspectRatio: '3/4',
                                    objectFit: 'cover'
                                }}
                            />
                        </Col>
                        <Col span={14}>
                            <Text strong style={{ fontSize: 16 }}>{item.itemName}</Text>
                            <div style={{ marginTop: 8 }}>
                                <Text type="secondary">数量：{item.quantity}</Text>
                            </div>
                        </Col>
                        <Col span={6} style={{ textAlign: 'right' }}>
                            <Text strong style={{ fontSize: 16 }}>
                                ¥{(item.price * item.quantity).toFixed(2)}
                            </Text>
                        </Col>
                    </Row>
                </Card>
            ))}

            <Row justify="space-between" align="middle" style={{ marginTop: 24 }}>
                <Col>
                    <Text strong style={{ fontSize: 18 }}>订单总额：</Text>
                    <Text style={{ fontSize: 24, color: '#1890ff', marginLeft: 8 }}>
                        ¥{totalAmount.toFixed(2)}
                    </Text>
                </Col>
            </Row>
        </Card>
    );
};

export default OrderCard;
