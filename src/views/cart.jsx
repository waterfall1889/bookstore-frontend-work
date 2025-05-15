// pages/CartPage.js
import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useOrder } from '../context/OrderContext';
import BasicLayout from '../components/layout';
import { Row, Col, Typography, Card, Empty, Modal, Button, Divider, message } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const CartPage = () => {
    const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
    const { addOrder } = useOrder();
    const navigate = useNavigate();
    const [checkoutVisible, setCheckoutVisible] = useState(false);

    const calculateTotal = () => {
        return cart.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    const handleCheckout = () => {
        if (cart.length === 0) {
            message.warning('购物车为空');
            return;
        }
        setCheckoutVisible(true);
    };

    const confirmCheckout = () => {
        try {
            addOrder([...cart], calculateTotal());
            clearCart();
            message.success('订单已创建');
            setCheckoutVisible(false);
            navigate('/orders');
        } catch (error) {
            console.error('Checkout error:', error);
            message.error('创建订单失败，请重试');
        }
    };

    return (
        <BasicLayout>
            <div style={{ maxWidth: 1200, margin: '0 auto', padding: 24 }}>
                <Title level={3} style={{ marginBottom: 24 }}>
                    <ShoppingCartOutlined /> 我的购物车
                </Title>

                {cart.length === 0 ? (
                    <Empty description="购物车空空如也" style={{ marginTop: 48 }}>
                        <Button type="primary" onClick={() => navigate('/books')}>
                            去逛逛
                        </Button>
                    </Empty>
                ) : (
                    <Card>
                        {cart.map(item => (
                            <React.Fragment key={item.id}>
                                <Row align="middle" gutter={16} style={{ padding: '16px 0' }}>
                                    <Col xs={24} sm={4}>
                                        <img
                                            src={item.cover}
                                            alt={item.title}
                                            style={{ width: '100%', maxWidth: '120px' }}
                                        />
                                    </Col>
                                    <Col xs={24} sm={14}>
                                        <Title level={5}>{item.title}</Title>
                                        <Text type="secondary">作者: {item.author}</Text>
                                        <br />
                                        <Text strong style={{ color: '#fa541c' }}>
                                            价格: ¥{item.price}
                                        </Text>
                                    </Col>
                                    <Col xs={24} sm={4}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <Button
                                                onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                            >
                                                -
                                            </Button>
                                            <span style={{ minWidth: '40px', textAlign: 'center' }}>
                                                {item.quantity}
                                            </span>
                                            <Button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            >
                                                +
                                            </Button>
                                        </div>
                                    </Col>
                                    <Col xs={24} sm={2}>
                                        <Button
                                            type="primary"
                                            danger
                                            onClick={() => {
                                                removeFromCart(item.id);
                                                message.success('已从购物车中移除');
                                            }}
                                        >
                                            删除
                                        </Button>
                                    </Col>
                                </Row>
                                <Divider style={{ margin: '16px 0' }} />
                            </React.Fragment>
                        ))}

                        <Row justify="space-between" align="middle" style={{ marginTop: 24 }}>
                            <Col>
                                <Title level={4} style={{ margin: 0 }}>
                                    总计：¥{calculateTotal().toFixed(2)}
                                </Title>
                            </Col>
                            <Col>
                                <Button
                                    type="primary"
                                    size="large"
                                    onClick={handleCheckout}
                                >
                                    去结算 ({cart.length}件)
                                </Button>
                            </Col>
                        </Row>
                    </Card>
                )}

                <Modal
                    title="确认订单"
                    open={checkoutVisible}
                    onOk={confirmCheckout}
                    onCancel={() => setCheckoutVisible(false)}
                    okText="确认支付"
                    cancelText="取消"
                >
                    <div style={{ padding: 16 }}>
                        <p>商品总数：{cart.length}件</p>
                        <p style={{ fontSize: 18 }}>
                            应付总额：<Text strong type="danger">¥{calculateTotal().toFixed(2)}</Text>
                        </p>
                    </div>
                </Modal>
            </div>
        </BasicLayout>
    );
};

export default CartPage;