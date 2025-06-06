import React from 'react';
import { Card, Row, Col, Typography, Image, Tag, Button, message, Space } from 'antd';
import { updateOrderStatus } from '../service/updateOrderStatusService';

const { Text, Title } = Typography;

const OrderCard = ({ order, onStatusUpdate }) => {
    const getStatusText = (status) => {
        switch (status) {
            case 'WFP':
                return '待付款';
            case 'IDL':
                return '运输中';
            case 'FIN':
                return '已完成';
            default:
                return status;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'WFP':
                return 'warning';
            case 'IDL':
                return 'processing';
            case 'FIN':
                return 'success';
            default:
                return 'default';
        }
    };

    const getNextStatus = (currentStatus) => {
        switch (currentStatus) {
            case 'WFP':
                return 'IDL';
            case 'IDL':
                return 'FIN';
            default:
                return null;
        }
    };

    const handleStatusUpdate = async () => {
        const nextStatus = getNextStatus(order.status);
        if (!nextStatus) {
            message.warning('当前状态无法更新');
            return;
        }

        try {
            await updateOrderStatus(order.orderId, nextStatus);
            message.success('订单状态更新成功');
            if (onStatusUpdate) {
                onStatusUpdate(order.orderId, nextStatus);
            }
        } catch (error) {
            message.error('更新订单状态失败：' + error.message);
        }
    };

    const totalAmount = order.items.reduce(
        (sum, item) => sum + item.price * item.counts,
        0
    );

    const renderActionButton = () => {
        const nextStatus = getNextStatus(order.status);
        if (!nextStatus) return null;

        const buttonText = nextStatus === 'IDL' ? '自动付款' : '确认收货';
        return (
            <Button 
                type="primary" 
                onClick={handleStatusUpdate}
                style={{ marginLeft: 16 }}
            >
                {buttonText}
            </Button>
        );
    };

    return (
        <Card style={{ marginBottom: 24, borderRadius: 8 }}>
            <Row justify="space-between" align="middle">
                <Col>
                    <Text type="secondary">订单号：{order.orderId}</Text>
                </Col>
                <Col>
                    <Space>
                        <Tag color={getStatusColor(order.status)}>
                            {getStatusText(order.status)}
                        </Tag>
                        {renderActionButton()}
                    </Space>
                </Col>
            </Row>

            <Row style={{ marginTop: 16, marginBottom: 16 }}>
                <Col span={24}>
                    <Text type="secondary">下单时间：{order.date}</Text>
                </Col>
            </Row>

            <Title level={5} style={{ marginBottom: 16 }}>商品信息</Title>
            {order.items.map(item => (
                <Card key={item.itemId} size="small" style={{ marginBottom: 12, backgroundColor: '#fafafa' }}>
                    <Row align="middle" gutter={16}>
                        <Col span={4}>
                            <Image
                                src={item.coverUrl}
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
                                <Text type="secondary">作者：{item.author}</Text>
                            </div>
                            <div style={{ marginTop: 4 }}>
                                <Text type="secondary">数量：{item.counts}</Text>
                            </div>
                        </Col>
                        <Col span={6} style={{ textAlign: 'right' }}>
                            <Text strong style={{ fontSize: 16 }}>
                                ¥{(item.price * item.counts).toFixed(2)}
                            </Text>
                            <div style={{ marginTop: 4 }}>
                                <Text type="secondary">单价：¥{item.price.toFixed(2)}</Text>
                            </div>
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
