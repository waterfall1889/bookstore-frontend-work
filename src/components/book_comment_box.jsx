import React, { useState } from 'react';
import { Row, Col, Typography, Rate, Divider, Space, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const comments = [
    {
        id: 1,
        rating: 4,
        commenter: 'XiaoWang123',
        commentContent: '很好的一本书，快递也很及时，就是包装有一些轻微破损',
        time: '2025-4-1',
        avatar: '/avatars/avatar1.jpg', // Avatar图片路径
    },
    {
        id: 2,
        rating: 5,
        commenter: 'Homo114514',
        commentContent: '相当好，物流很快，印刷质量也相当不错',
        time: '2025-4-2',
        avatar: '/avatars/avatar2.jpg', // Avatar图片路径
    },
    {
        id: 3,
        rating: 2,
        commenter: 'Zombie2',
        commentContent: '客服你们是认真的吗？发货竟然能发错书？前后退换白白耽误半个月！',
        time: '2025-4-4',
        avatar: '/avatars/avatar3.jpg', // Avatar图片路径
    },
];

const { Title, Text } = Typography;

const BookCommentBox = () => {
    const [commentList] = useState(comments);
    //所有评论都通过 .map() 动态渲染出来，UI 上美观、模块化。
    return (
        <div style={{ padding: '24px' }}>
            <Title level={2}>评论区</Title>
            <Divider />
            {commentList.map((comment) => (
                <div key={comment.id} style={{ marginBottom: '24px' }}>
                    <Row gutter={[16, 16]} align="middle">
                        <Col>
                            <Avatar
                                src={comment.avatar || <UserOutlined />}
                                size={50}
                                alt={comment.commenter}
                            />
                        </Col>
                        <Col flex="auto">
                            <Space direction="vertical" style={{ width: '100%' }}>
                                <Space>
                                    <Text strong>{comment.commenter}</Text>
                                    <Text type="secondary">{comment.time}</Text>
                                </Space>
                                <Rate disabled defaultValue={comment.rating} />
                                <Text style={{ display: 'block' }}>{comment.commentContent}</Text>
                            </Space>
                        </Col>
                    </Row>
                    <Divider />
                </div>
            ))}
        </div>
    );
};

export default BookCommentBox;
