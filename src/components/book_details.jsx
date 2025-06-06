import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Row, Col, Typography, Button, Space, InputNumber, message, Spin } from 'antd';
import { fetchBookDescription } from '../service/bookDescriptionService';
import { fetchBook } from '../service/bookcardService';
import { getUserId } from "../utils/ID-Storage";
import { addToCart } from '../service/addCartService'; // 假设你有这个服务

const { Title, Text, Paragraph } = Typography;

export default function BookDetail() {
    const { id } = useParams();
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

    const handleAdd = async () => {
        const userId = getUserId(); // 获取当前用户的 ID

        try {
            const response = await addToCart(userId, book.itemId, quantity);
            alert("已成功将"+ quantity + "本该书籍加入购物车");
        }
        catch (error) {
            console.error("添加到购物车失败", error);
            message.error("加入购物车时发生错误");
        }
    }

    return (
        <div style={{ padding: '24px' }}>
            <Row gutter={[32, 24]}>
                <Col xs={24} md={10}>
                    <img
                        src={book.coverUrl}
                        alt={book.itemName}
                        style={{
                            width: '100%',
                            borderRadius: '8px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        }}
                    />
                </Col>

                <Col xs={24} md={14}>
                    <Title level={2}>{book.itemName}</Title>
                    <Text strong>作者：</Text><Text>{book.author}</Text>
                    <br /><br />
                    <Text strong>价格：</Text>
                    <Text type="danger" style={{ fontSize: '18px' }}>￥{Number(book.price).toFixed(2)}</Text>
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
                        disabled={book.remain_number === 0}
                        onClick={handleAdd}
                    >
                        加入购物车
                    </Button>
                </Col>
            </Row>
        </div>
    );
}
