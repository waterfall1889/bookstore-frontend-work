import React from 'react';
import { Card, Typography, Image, Button } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const Book_card = ({ book, showDetailButton = true, EditButton = true, onClick }) => {
    const navigate = useNavigate();

    // 日志打印封面图片URL
    if (book.coverUrl) {
        console.log(`Book_card: 书名=${book.itemName || book.name}，封面URL=${book.coverUrl}`);
    } else {
        console.log(`Book_card: 书名=${book.itemName || book.name}，无封面URL，使用默认图片`);
    }

    const goToDetail = () => {
        navigate(`/books/${book.itemId}`);
    };

    const goToBookDetailEdit = () => {
        navigate(`/booksEdit/${book.itemId}`);
    }

    const handleCardClick = () => {
        if (onClick) {
            onClick(book);
        } else if (showDetailButton) {
            goToDetail();
        }
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
                    src={book.coverUrl}
                    alt={book.itemName}
                    height={300}
                    style={{ objectFit: 'cover' }}
                    preview={false}
                />
            }
            onClick={handleCardClick}
        >
            <Title level={5} style={{ marginBottom: 8 }}>{book.itemName}</Title>
            <Text type="secondary">作者：{book.author}</Text><br />
            <Text strong style={{ color: '#fa541c' }}>价格：¥{Number(book.price).toFixed(2)}</Text><br />
            <Text type="secondary">库存：{book.remainNumber}</Text><br />
            <Text type="secondary">出版社：{book.publish}</Text><br />
            <Text type="secondary">ISBN：{book.isbn}</Text>
            {showDetailButton && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
                    <Button type="primary" size="small" style={{ width: '100%' }} onClick={(e) => {
                        e.stopPropagation();
                        goToDetail();
                    }}>
                        查看详情
                    </Button>
                </div>
            )}
            {EditButton && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
                    <Button type="primary" size="small" style={{ width: '100%' }} onClick={(e) => {
                        e.stopPropagation();
                        goToBookDetailEdit();
                    }}>
                        信息编辑
                    </Button>
                </div>
            )}
        </Card>
    );
};

export default Book_card;
