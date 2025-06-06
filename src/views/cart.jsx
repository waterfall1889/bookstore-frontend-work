import React, { useState, useEffect } from 'react';
import { Row, Col, Typography, Card, Empty, Button, message, Spin } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { fetchCart } from "../service/CartInitialService";
import { getUserId } from "../utils/ID-Storage";
import CartItem from '../components/cart_list';
import BasicLayout from "../components/layout";
import {removeCartItem} from "../service/removeCartItemService";
import {useNavigate} from "react-router-dom";
import {Checkout} from "../service/CheckoutService";

const { Title, Text } = Typography;

const CartPage = () => {
    const navigate = useNavigate();
    const [cartData, setCartData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [checkoutLoading, setCheckoutLoading] = useState(false);

    useEffect(() => {
        const loadCartData = async () => {
            try {
                const data = await fetchCart(getUserId());
                setCartData(data);
            } catch (error) {
                message.error(error.message || '加载购物车失败');
            } finally {
                setLoading(false);
            }
        };

        loadCartData();
    }, []);

    if (loading) {
        return (
            <BasicLayout>
                <div style={{ textAlign: 'center', padding: '50px' }}>
                    <Spin size="large" />
                </div>
            </BasicLayout>
        );
    }

    if (!cartData || cartData.length === 0) {
        return (
            <BasicLayout>
                <Empty description="购物车空空如也" style={{ marginTop: 48 }}>
                    <Button type="primary" onClick={() => navigate('/books')}>
                        去逛逛
                    </Button>
                </Empty>
            </BasicLayout>
        );
    }

    const totalCost = cartData.reduce((acc, item) => acc + item.item.price * item.counts, 0);

    const handleItemRemove = async (itemId) => {
        try {
            await removeCartItem(getUserId(), itemId);
            const data = await fetchCart(getUserId());
            setCartData(data);
            message.success('商品已从购物车中移除');
        } catch (error) {
            message.error('删除商品失败：' + error.message);
        }
    };

    const handleCheckout = async () => {
        try {
            setCheckoutLoading(true);
            await Checkout(getUserId());
            const data = await fetchCart(getUserId());
            setCartData(data);
            message.success('结算成功！即将跳转前往订单页面...');
            navigate('/orders');
        } catch (error) {
            message.error('结算失败：' + error.message);
        } finally {
            setCheckoutLoading(false);
        }
    };

    return (
        <BasicLayout>
            <div style={{ maxWidth: 1200, margin: '0 auto', padding: 24 }}>
                <Title level={3} style={{ marginBottom: 24 }}>
                    <ShoppingCartOutlined /> 我的购物车
                </Title>

                <Card>
                    {cartData.map(cartItem => (
                        <CartItem
                            key={cartItem.itemId}
                            item={{
                                itemId: cartItem.itemId,
                                itemName: cartItem.item.itemName,
                                price: cartItem.item.price,
                                counts: cartItem.counts,
                                coverUrl: cartItem.item.coverUrl
                            }}
                            handleItemRemove={handleItemRemove}
                        />
                    ))}

                    <Row justify="space-between" align="middle" style={{ marginTop: 24 }}>
                        <Col>
                            <Title level={4} style={{ margin: 0 }}>
                                总计：¥{totalCost.toFixed(2)}
                            </Title>
                        </Col>
                        <Col>
                            <Button
                                type="primary"
                                size="large"
                                onClick={handleCheckout}
                                loading={checkoutLoading}
                            >
                                去结算
                            </Button>
                        </Col>
                    </Row>
                </Card>
            </div>
        </BasicLayout>
    );
};

export default CartPage;
