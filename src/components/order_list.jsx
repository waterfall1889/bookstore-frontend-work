import React, { useState } from 'react';
import { Row, Col, Typography, Divider, Space, Image, Button, Popconfirm, Tag } from 'antd';

const { Title, Text } = Typography;

const initialOrder = [
    {
        OrderTime: "2025-04-18",
        OrderID: 250418320303,
        status: "待支付", // 待支付、运输中、已收货
        purchaseData: [
            {
                bookID: 1,
                bookname: "挪威的森林",
                number: 1,
                singleCost: 40,
                bookCover: '/bookcovers/book1.jpg'
            },
            {
                bookID: 2,
                bookname: "没有英雄的叙事诗",
                number: 2,
                singleCost: 68,
                bookCover: '/bookcovers/book2.jpg'
            }
        ]
    },
    {
        OrderTime: "2025-04-19",
        OrderID: 250418320305,
        status: "待支付", // 待支付、运输中、已收货
        purchaseData: [
            {
                bookID: 1,
                bookname: "挪威的森林",
                number: 1,
                singleCost: 40,
                bookCover: '/bookcovers/book1.jpg'
            },
            {
                bookID: 2,
                bookname: "没有英雄的叙事诗",
                number: 2,
                singleCost: 68,
                bookCover: '/bookcovers/book2.jpg'
            }
        ]
    }
];

const statusColor = {
    "待支付": "red",
    "运输中": "blue",
    "已收货": "green",
};

const OrderList = () => {
    const [orders, setOrders] = useState(initialOrder);

    const handlePay = (orderID) => {
        setOrders(prevOrders =>
            prevOrders.map(order =>
                order.OrderID === orderID ? { ...order, status: '运输中' } : order
            )
        );
    };

    const handleConfirmReceipt = (orderID) => {
        setOrders(prevOrders =>
            prevOrders.map(order =>
                order.OrderID === orderID ? { ...order, status: '已收货' } : order
            )
        );
    };

    return (
        <div style={{ padding: 24 }}>
            <Title level={2}>我的订单</Title>
            <Divider />
            {orders.map(order => (
                <div key={order.OrderID} style={{ marginBottom: 48 }}>
                    <Row justify="space-between" align="middle">
                        <Col>
                            <Text strong>下单时间：</Text>{order.OrderTime}
                        </Col>
                        <Col>
                            <Tag color={statusColor[order.status]}>{order.status}</Tag>
                        </Col>
                    </Row>
                    <Divider />

                    {order.purchaseData.map(item => (
                        <Row key={item.bookID} gutter={[16, 16]} align="middle" style={{ marginBottom: 16 }}>
                            <Col span={4}>
                                <Image width={80} src={item.bookCover} />
                            </Col>
                            <Col span={16}>
                                <Space direction="vertical">
                                    <Text strong>{item.bookname}</Text>
                                    <Text>数量：{item.number}</Text>
                                    <Text>单价：¥{item.singleCost}</Text>
                                </Space>
                            </Col>
                            <Col span={4} style={{ textAlign: 'right' }}>
                                <Text strong>总价：¥{item.singleCost * item.number}</Text>
                            </Col>
                        </Row>
                    ))}

                    <Divider />
                    <Row justify="end">
                        {order.status === '待支付' && (
                            <Popconfirm
                                title="确认支付吗？"
                                onConfirm={() => handlePay(order.OrderID)}
                                okText="确认"
                                cancelText="取消"
                            >
                                <Button type="primary">支付</Button>
                            </Popconfirm>
                        )}
                        {order.status === '运输中' && (
                            <Popconfirm
                                title="确认已经收货？"
                                onConfirm={() => handleConfirmReceipt(order.OrderID)}
                                okText="确认"
                                cancelText="取消"
                            >
                                <Button type="primary">确认收货</Button>
                            </Popconfirm>
                        )}
                    </Row>
                </div>
            ))}
        </div>
    );
};

export default OrderList;
