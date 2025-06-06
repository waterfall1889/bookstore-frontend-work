import React from 'react';
import { Row, Col, Image, Typography, Button } from 'antd';

const { Text } = Typography;

const CartItem = ({ item, handleItemRemove }) => {
    const handleDelete = () => {
        handleItemRemove(item.itemId);
        alert("已经成功删除购物车商品！");
    };

    return (
        <Row align="middle" gutter={16} style={{ padding: 16 }}>
            <Col span={4}>
                <Image
                    src={item.coverUrl}
                    alt={item.itemName}
                    preview={false}
                    style={{ borderRadius: 4 }}
                />
            </Col>

            <Col span={12}>
                <Text strong style={{ fontSize: 16 }}>{item.itemName}</Text>
                <div style={{ marginTop: 8 }}>
                    <Text type="secondary">单价：¥{Number(item.price).toFixed(2)}</Text>
                </div>
            </Col>

            <Col span={4}>
                <Text>数量: {item.counts}</Text>
            </Col>

            <Col span={4}>
                <Button type="primary" danger onClick={handleDelete}>
                    删除
                </Button>
            </Col>
        </Row>
    );
};

export default CartItem;
