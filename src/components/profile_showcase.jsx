import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Flex, Avatar, Typography, Card, message } from 'antd';
import { fetchUserProfile } from '../service/getProfileService';
import {getUserId} from "../utils/ID-Storage";

const { Title, Paragraph } = Typography;

const Profile_showcase = () => {
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {

        const userId = getUserId();

        fetchUserProfile(userId)
            .then(data => setUserInfo(data))
            .catch(() => message.error('加载用户信息失败'));
    }, []);

    if (!userInfo) {
        return <div>加载中...</div>;
    }

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
                    <Avatar size={120} src={userInfo.avatar} />
                    <div style={{ width: '100%' }}>
                        <Title level={3} style={{ textAlign: 'center' }}>
                            {userInfo.name}
                        </Title>
                        <Paragraph><strong>ID：</strong>{userInfo.IDNumber}</Paragraph>
                        <Paragraph><strong>邮箱：</strong>{userInfo.email}</Paragraph>
                        <Paragraph><strong>用户级别：</strong>{userInfo.role === 'BASIC' ? '普通会员':'超级会员'}</Paragraph>
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
