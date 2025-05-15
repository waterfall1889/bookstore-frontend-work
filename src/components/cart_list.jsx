import React from 'react';
import { Row, Col, Image, Typography, InputNumber, Button } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

const { Text } = Typography;

const CartItem = ({ item, onUpdate, onRemove }) => {
    return (
        <Row align="middle" gutter={16} style={{ padding: 16 }}>
            <Col span={4}>
                <Image
                    src={item.cover}
                    alt={item.title}
                    preview={false}
                    style={{ borderRadius: 4 }}
                />
            </Col>

            <Col span={12}>
                <Text strong style={{ fontSize: 16 }}>{item.title}</Text>
                <div style={{ marginTop: 8 }}>
                    <Text type="secondary">单价：¥{item.price.toFixed(2)}</Text>
                </div>
            </Col>

            <Col span={6}>
                <InputNumber
                    min={1}
                    value={item.quantity}
                    onChange={value => onUpdate(item.id, value)}
                    style={{ width: '100%' }}
                />
            </Col>

            <Col span={2}>
                <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => onRemove(item.id)}
                />
            </Col>
        </Row>
    );
};

export default CartItem;