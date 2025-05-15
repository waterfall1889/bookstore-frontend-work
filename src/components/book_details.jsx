import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Row, Col, Typography, Rate, Button, Space, InputNumber, message, Spin } from 'antd';
import { useCart } from '../context/CartContext';
import { fetchBookDescription } from '../service/bookDescriptionService';
import { fetchBook } from '../service/bookcardService';

const { Title, Text, Paragraph } = Typography;

export default function BookDetail() {
    const { id } = useParams();
    const { addToCart } = useCart();
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        async function loadBook() {
            try {
                setLoading(true);
                const [bookInfo, descriptionInfo] = await Promise.all([
                    fetchBook(id),
                    fetchBookDescription(id)
                ]);
                setBook({
                    ...bookInfo,
                    description: descriptionInfo.description
                });
                setQuantity(1);
            } catch (error) {
                console.error(error);
                message.error("加载图书信息失败");
            } finally {
                setLoading(false);
            }
        }

        loadBook();
    }, [id]);

    const handleAddToCart = () => {
        if (!book) return;

        if (book.remain_number === 0) {
            message.warning("该图书已售罄");
            return;
        }
        if (quantity > book.remain_number) {
            message.warning("超过库存数量！");
            return;
        }

        addToCart({
            id: book.item_id,
            title: book.item_name,
            author: book.author,
            price: parseFloat(book.price),
            cover: book.cover_url,
            rate: 0  // 后端没有评分字段，设为 0 或忽略
        }, quantity);

        alert(`成功添加 ${quantity} 本《${book.item_name}》到购物车`);
    };

    if (loading) {
        return (
            <div style={{ padding: '24px', textAlign: 'center' }}>
                <Spin tip="加载中..." size="large" />
            </div>
        );
    }

    if (!book) {
        return (
            <div style={{ padding: '24px' }}>
                <Title level={3}>未找到图书</Title>
                <Text type="secondary">请检查图书 ID 是否正确。</Text>
            </div>
        );
    }

    return (
        <div style={{ padding: '24px' }}>
            <Row gutter={[32, 24]}>
                <Col xs={24} md={10}>
                    <img
                        src={book.cover_url}
                        alt={book.item_name}
                        style={{
                            width: '100%',
                            borderRadius: '8px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        }}
                    />
                </Col>

                <Col xs={24} md={14}>
                    <Title level={2}>{book.item_name}</Title>
                    <Text strong>作者：</Text><Text>{book.author}</Text>
                    {/*<br /><br />
                    <Text strong>评分：</Text>
                    <Rate allowHalf disabled defaultValue={0} />*/}
                    <br /><br />
                    <Text strong>价格：</Text>
                    <Text type="danger" style={{ fontSize: '18px' }}>￥{book.price}</Text>
                    <br /><br />
                    <Text strong>存货数量：</Text><Text>{book.remain_number}</Text>
                    <br /><br />
                    <Text strong>简介：</Text>
                    <Paragraph>{book.description}</Paragraph>
                    <br />
                    <Space>
                        <Text strong>购买数量：</Text>
                        <InputNumber
                            min={1}
                            max={book.remain_number}
                            value={quantity}
                            onChange={setQuantity}
                            style={{ width: '100px' }}
                        />
                    </Space>
                    <br /><br />
                    <Button
                        type="primary"
                        size="large"
                        onClick={handleAddToCart}
                        disabled={book.remain_number === 0}
                    >
                        加入购物车
                    </Button>
                </Col>
            </Row>
        </div>
    );
}
