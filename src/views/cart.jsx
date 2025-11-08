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
import webSocketService from "../service/WebSocketService";

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

        // 建立WebSocket连接
        const userId = getUserId();
        if (userId) {
            console.log('准备建立WebSocket连接...');
            webSocketService.connect(userId)
                .then(() => {
                    console.log('WebSocket连接成功');
                })
                .catch((error) => {
                    console.error('WebSocket连接失败:', error);
                });
        }

        // 组件卸载时断开WebSocket
        return () => {
            console.log('组件卸载，断开WebSocket连接');
            webSocketService.disconnect();
        };
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
            
            // 注册WebSocket订单结果处理器
            webSocketService.on('order_result', (data, message, timestamp) => {
                console.log('收到订单处理结果:', data);
                
                const { orderId, status, message: orderMessage } = data;
                
                const statusText = status === 'WFP' ? '待支付' : 
                                  status === 'IDL' ? '运输中' : 
                                  status === 'FIN' ? '已完成' : status;

                // 显示订单创建成功的提示
                alert(`订单创建成功！\n订单号: ${orderId}\n订单状态: ${statusText}\n${orderMessage}\n\n即将跳转到订单页面...`);

                // 刷新购物车
                fetchCart(getUserId()).then(data => setCartData(data));
                
                // 跳转到订单页面
                setTimeout(() => {
                    navigate('/orders');
                }, 1000);
            });

            // 调用结算接口
            const checkoutResponse = await Checkout(getUserId());
            console.log('结算响应:', checkoutResponse);
            
            // 获取新创建的订单ID
            const orderId = checkoutResponse.orderId || checkoutResponse.id;
            
            if (!orderId) {
                throw new Error('未能获取订单ID');
            }

            // 显示订单创建中的提示
            alert(`订单创建中...\n订单号: ${orderId}\n正在处理您的订单，请稍候...\n\n订单结果将通过WebSocket实时推送`);

        } catch (error) {
            console.error('结算失败:', error);
            
            // 显示错误信息
            alert(`结算失败\n${error.message || '订单创建失败，请重试'}`);
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
