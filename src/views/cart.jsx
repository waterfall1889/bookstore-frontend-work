import React, { useState, useEffect } from 'react';
import { Row, Col, Typography, Card, Empty, Button } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { fetchCart } from "../service/CartInitialService";
import { getUserId } from "../utils/ID-Storage";
import CartItem from '../components/cart_list';
import BasicLayout from "../components/layout";
import {removeCartItem} from "../service/removeCartItemService";
import {useNavigate} from "react-router-dom";  // 引入 CartItem 组件

const { Title, Text } = Typography;

const CartPage = () => {
    const navigate = useNavigate();
    const [cartData, setCartData] = useState(null);  // 存储购物车数据
    const [loading, setLoading] = useState(true);    // 控制加载状态

    useEffect(() => {
        const loadCartData = async () => {
            try {
                const data = await fetchCart(getUserId());
                setCartData(data);
            } catch (error) {
                console.error(error.message || '加载购物车失败');
            } finally {
                setLoading(false);
            }
        };

        loadCartData();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    // 如果购物车为空，显示空状态
    if (!cartData || !cartData.items || cartData.items.length === 0) {
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

    // 计算总价
    const totalCost = cartData.items.reduce((acc, item) => acc + item.price * item.counts, 0);

    const handleItemRemove = async (itemId) => {
        await removeCartItem(getUserId(), itemId);
        const data = await fetchCart(getUserId()); // 重新加载购物车
        setCartData(data);
    };

    const handleCheckout = async (userId) => {

    }


    return (
        <BasicLayout>
            <div style={{ maxWidth: 1200, margin: '0 auto', padding: 24 }}>
                <Title level={3} style={{ marginBottom: 24 }}>
                    <ShoppingCartOutlined /> 我的购物车
                </Title>

                <Card>
                    {cartData.items.map(item => (
                        <CartItem
                            key={item.itemId}
                            item={item}          // 将 item 传递给 CartItem
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
                            >
                                去结算 ({cartData.items.length}件)
                            </Button>
                        </Col>
                    </Row>
                </Card>
            </div>
        </BasicLayout>
    );
};

export default CartPage;
