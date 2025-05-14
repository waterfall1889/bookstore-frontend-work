import React, { useContext } from 'react';
import { Row, Col, Typography, Divider, Space, Image, Button, InputNumber, Popconfirm } from 'antd';
import { ShoppingCartOutlined, DeleteOutlined } from '@ant-design/icons';
import { CartContext } from '../context/CartContext'; // 你自己的上下文路径

const { Title, Text } = Typography;

const CartList = () => {
    const { cartList, updateQuantity, removeFromCart } = useContext(CartContext);

    const handleQuantityChange = (id, value) => {
        updateQuantity(id, value);
    };

    const handleDelete = (id) => {
        removeFromCart(id);
    };

    const getTotalPrice = () => {
        return cartList.reduce((total, item) => total + item.singleCost * item.number, 0);
    };

    return (
        <div style={{ padding: '24px' }}>
            <Title level={2}><ShoppingCartOutlined /> 我的购物车 </Title>
            <Divider />
            {cartList.map((item) => (
                <div key={item.id} style={{ marginBottom: '24px' }}>
                    <Row gutter={[16, 16]} align="middle" justify="space-between">
                        <Col>
                            <Image src={item.bookCover} height={100} width={75} />
                        </Col>
                        <Col flex="auto">
                            <Space direction="vertical">
                                <Text strong>{item.bookname}</Text>
                                <div>
                                    数量：
                                    <InputNumber
                                        min={1}
                                        value={item.number}
                                        onChange={(value) => handleQuantityChange(item.id, value)}
                                    />
                                </div>
                                <Text>单价：¥{item.singleCost}</Text>
                                <Text type="success">小计：¥{item.singleCost * item.number}</Text>
                            </Space>
                        </Col>
                        <Col>
                            <Button>结算</Button>
                        </Col>
                        <Col>
                            <Popconfirm
                                title="确认删除该商品？"
                                onConfirm={() => handleDelete(item.id)}
                                okText="确认"
                                cancelText="取消"
                            >
                                <Button danger icon={<DeleteOutlined />} />
                            </Popconfirm>
                        </Col>
                    </Row>
                    <Divider />
                </div>
            ))}
            <div style={{ padding: '24px' }}>
                <Row gutter={[16, 16]} align="middle" justify="space-between">
                    <Col>
                        <Text strong style={{ fontSize: '30px' }}>
                            总计:￥{getTotalPrice()}
                        </Text>
                    </Col>
                    <Col>
                        <Button type="primary">全部结算</Button>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default CartList;
