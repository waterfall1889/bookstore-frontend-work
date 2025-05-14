import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useOrder } from '../context/OrderContext';
import BasicLayout from '../components/layout';
import { Row, Col, Typography, Button, InputNumber, Card, Image, message, Modal } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const { addOrder } = useOrder();
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      message.warning('购物车为空');
      return;
    }
    setIsModalVisible(true);
  };

  const handleModalOk = () => {
    try {
      addOrder([...cart], calculateTotal());
      clearCart();
      message.success('订单已创建');
      setIsModalVisible(false);
      navigate('/orders');
    } catch (error) {
      console.error('Checkout error:', error);
      message.error('创建订单失败，请重试');
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  if (cart.length === 0) {
    return (
      <BasicLayout>
        <div style={{ padding: '24px' }}>
          <Title level={2}>购物车</Title>
          <Text type="secondary">您的购物车是空的</Text>
        </div>
      </BasicLayout>
    );
  }

  return (
    <BasicLayout>
      <div style={{ padding: '24px' }}>
        <Title level={2}>购物车</Title>
        <Row gutter={[16, 16]}>
          {cart.map((item) => (
            <Col key={item.id} xs={24}>
              <Card>
                <Row align="middle" gutter={16}>
                  <Col xs={24} sm={4}>
                    <Image
                      src={item.cover}
                      alt={item.title}
                      style={{ width: '100%', maxWidth: '120px' }}
                      preview={false}
                    />
                  </Col>
                  <Col xs={24} sm={14}>
                    <Title level={4}>{item.title}</Title>
                    <Text type="secondary">作者: {item.author}</Text>
                    <br />
                    <Text strong style={{ color: '#fa541c' }}>价格: ¥{item.price}</Text>
                  </Col>
                  <Col xs={24} sm={4}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Button
                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                      >
                        -
                      </Button>
                      <InputNumber
                        min={1}
                        value={item.quantity}
                        onChange={(value) => updateQuantity(item.id, value)}
                        style={{ width: '60px' }}
                      />
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
              </Card>
            </Col>
          ))}
        </Row>

        <Card style={{ marginTop: '24px' }}>
          <Row justify="space-between" align="middle">
            <Col>
              <Title level={3} style={{ margin: 0 }}>
                总计: ¥{calculateTotal().toFixed(2)}
              </Title>
            </Col>
            <Col>
              <Button type="primary" size="large" onClick={handleCheckout}>
                结算
              </Button>
            </Col>
          </Row>
        </Card>

        <Modal
          title="确认结算"
          open={isModalVisible}
          onOk={handleModalOk}
          onCancel={handleModalCancel}
        >
          <p>总计：¥{calculateTotal().toFixed(2)}</p>
        </Modal>
      </div>
    </BasicLayout>
  );
};

export default Cart;