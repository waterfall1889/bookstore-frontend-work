import React from 'react';
import { Card, Typography, Rate, Image, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const { Title, Text } = Typography;

const Book_card = ({ book }) => {
    const navigate = useNavigate();
    const { addToCart } = useCart();

    const goToDetail = () => {
        navigate(`/books/${book.item_id}`);
    };

    const handleAddToCart = () => {
        addToCart({
            id: book.item_id,
            title: book.item_name,
            author: book.author,
            price: parseFloat(book.price),
            cover: book.cover_url,
            rate: 4.5  // 后端未返回评分字段，可以写死默认值
        });
        message.success('已添加到购物车');
    };

    return (
        <Card
            hoverable
            style={{
                width: 240,
                borderRadius: 16,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                overflow: 'hidden',
            }}
            cover={
                <Image
                    src={book.cover_url}
                    alt={book.item_name}
                    height={300}
                    style={{ objectFit: 'cover' }}
                    preview={false}
                />
            }
        >
            <Title level={5} style={{ marginBottom: 8 }}>{book.item_name}</Title>
            <Text type="secondary">作者：{book.author}</Text><br />
            <Text strong style={{ color: '#fa541c' }}>价格：¥{book.price}</Text><br />
            {/*<Rate disabled allowHalf defaultValue={4.5} style={{ fontSize: 14, marginBottom: 12 }} /><br />*/}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <Button type="primary" size="small" style={{ width: '100%' }} onClick={goToDetail}>
                    查看详情
                </Button>
                {/*<Button size="small" style={{ width: '100%' }} onClick={handleAddToCart}>
                    加入购物车
                </Button>*/}
            </div>
        </Card>
    );
};

export default Book_card;
