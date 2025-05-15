// components/OrderCard.js
import React from 'react';
import { Card, Row, Col, Typography, Image, Tag, Popconfirm, Button } from 'antd';
import { ClockCircleOutlined, CarOutlined, CheckCircleOutlined } from '@ant-design/icons';

const { Text, Title } = Typography;

const statusConfig = {
    '待支付': {
        color: 'orange',
        icon: <ClockCircleOutlined />,
        actions: ['pay']
    },
    '运输中': {
        color: 'blue',
        icon: <CarOutlined />,
        actions: ['confirm']
    },
    '已完成': {
        color: 'green',
        icon: <CheckCircleOutlined />,
        actions: []
    }
};

const OrderCard = ({ order, onAction }) => {
    const totalAmount = order.items.reduce(
        (sum, item) => sum + (item.price * item.quantity),
        0
    );

    return (
        <Card
            style={{ marginBottom: 24, borderRadius: 8 }}
            headStyle={{ borderBottom: 0 }}
            title={
                <Row justify="space-between" align="middle">
                    <Col>
                        <Text type="secondary">
                            订单号：{order.id}
                        </Text>
                    </Col>
                    <Col>
                        <Tag
                            icon={statusConfig[order.status].icon}
                            color={statusConfig[order.status].color}
                            style={{ padding: '4px 8px', borderRadius: 4 }}
                        >
                            {order.status}
                        </Tag>
                    </Col>
                </Row>
            }
        >
            <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
                <Col span={24}>
                    <Text type="secondary">
                        下单时间：{new Date(order.orderTime).toLocaleString()}
                    </Text>
                </Col>
            </Row>

            <Title level={5} style={{ marginBottom: 16 }}>商品信息</Title>
            {order.items.map(item => (
                <Card
                    key={item.id}
                    size="small"
                    style={{ marginBottom: 12, backgroundColor: '#fafafa' }}
                >
                    <Row align="middle" gutter={16}>
                        <Col span={4}>
                            <Image
                                src={item.cover}
                                alt={item.title}
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
                            <Text strong style={{ fontSize: 16 }}>{item.title}</Text>
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
                    <Text style={{
                        fontSize: 24,
                        color: '#1890ff',
                        marginLeft: 8
                    }}>
                        ¥{totalAmount.toFixed(2)}
                    </Text>
                </Col>
                <Col>
                    {statusConfig[order.status].actions.includes('pay') && (
                        <Popconfirm
                            title="确认支付订单？"
                            description={`总金额：¥${totalAmount.toFixed(2)}`}
                            okText="立即支付"
                            cancelText="再想想"
                            onConfirm={() => onAction(order.id, '运输中')}
                        >
                            <Button
                                type="primary"
                                size="large"
                                style={{ minWidth: 120 }}
                            >
                                立即支付
                            </Button>
                        </Popconfirm>
                    )}
                    {statusConfig[order.status].actions.includes('confirm') && (
                        <Popconfirm
                            title="确认收到商品？"
                            description="请确认已收到完整包裹"
                            okText="确认收货"
                            cancelText="取消"
                            onConfirm={() => onAction(order.id, '已完成')}
                        >
                            <Button
                                type="primary"
                                size="large"
                                style={{ minWidth: 120 }}
                            >
                                确认收货
                            </Button>
                        </Popconfirm>
                    )}
                </Col>
            </Row>
        </Card>
    );
};

export default OrderCard;