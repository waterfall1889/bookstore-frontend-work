import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Flex, Avatar, Typography, Card } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const Profile_showcase = () => {
    const navigate = useNavigate();

    // 使用 useState 来管理用户信息
    const [userInfo, setUserInfo] = useState({
        name: 'admin',
        IDNumber: '54749110',
        email: 'zhangsan@example.com',
        role: '普通用户',
        registeredAt: '2024-4-1',
        phoneNumber: '0123456789',
        description: '这是一个测试用户，未来将通过后端导入信息。',
    });

    return (
        <Flex justify="center" align="center" style={{ minHeight: '80vh' }}>
            <Card
                style={{
                    maxWidth: 600,
                    width: '100%',
                    padding: '24px',
                    borderRadius: '16px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                }}
            >
                <Flex vertical align="center" gap={24}>
                    <Avatar size={120} src={'/head.jpg'} />
                    <div style={{ width: '100%' }}>
                        <Title level={3} style={{ textAlign: 'center' }}>
                            {userInfo.name}
                        </Title>
                        <Paragraph><strong>ID：</strong>{userInfo.IDNumber}</Paragraph>
                        <Paragraph><strong>邮箱：</strong>{userInfo.email}</Paragraph>
                        <Paragraph><strong>身份：</strong>{userInfo.role}</Paragraph>
                        <Paragraph><strong>注册时间：</strong>{userInfo.registeredAt}</Paragraph>
                        <Paragraph><strong>绑定手机号码：</strong>{userInfo.phoneNumber}</Paragraph>
                        <Paragraph><strong>个人说明：</strong>{userInfo.description}</Paragraph>
                    </div>
                    <Button type="primary" onClick={() => navigate('/ProfileEdit')}>
                        修改个人信息
                    </Button>
                </Flex>
            </Card>
        </Flex>
    );
};

export default Profile_showcase;

