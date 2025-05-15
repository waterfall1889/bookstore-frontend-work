import React, { useState, useEffect } from 'react';
import { Row, Col, Typography, Rate, Divider, Space, Avatar, Spin, message } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { fetchBookComment } from '../service/commentService';
import {fetchUserProfile} from "../service/getProfileService";

const { Title, Text } = Typography;

const BookCommentBox = ({ bookId }) => {
    const [commentList, setCommentList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadComments = async () => {
            try {
                const data = await fetchBookComment(bookId);
                // 兼容后端返回的是单条或多条评论
                const list = Array.isArray(data) ? data : [data];
                setCommentList(list);
            } catch (err) {
                message.error(err.message || "评论加载失败");
            } finally {
                setLoading(false);
            }
        };

        loadComments();
    }, [bookId]);

    return (
        <div style={{ padding: '24px' }}>
            <Title level={2}>评论区</Title>
            <Divider />
            {loading ? (
                <Spin />
            ) : commentList.length === 0 ? (
                <Text type="secondary">暂无评论</Text>
            ) : (
                commentList.map((comment) => (
                    <div key={comment.comment_id} style={{ marginBottom: '24px' }}>
                        <Row gutter={[16, 16]} align="middle">
                            <Col>
                                <Avatar
                                    src={comment.comment_avatar || <UserOutlined />}
                                    size={50}
                                    alt={comment.commenter_id}
                                />
                            </Col>
                            <Col flex="auto">
                                <Space direction="vertical" style={{ width: '100%' }}>
                                    <Space>
                                        <Text strong>{comment.comment_username}</Text>
                                        <Text type="secondary">{comment.comment_time}</Text>
                                    </Space>
                                    <Rate disabled defaultValue={comment.rating} />
                                    <Text style={{ display: 'block' }}>{comment.comment}</Text>
                                </Space>
                            </Col>
                        </Row>
                        <Divider />
                    </div>
                ))
            )}
        </div>
    );
};

export default BookCommentBox;
