import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from 'antd/es/layout/layout';
import {Avatar, Image, message, Space} from 'antd';
import {fetchUserProfile} from "../service/getProfileService";
import {getUserId} from "../utils/ID-Storage";

const HeaderComponent = () => {
    const navigate = useNavigate();

    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {

        const userId = getUserId();

        fetchUserProfile(userId)
            .then(data => setUserInfo(data))
            .catch(() => message.error('加载用户信息失败'));
    }, []);

    return (
        <Header style={{ background: '#000', padding: '0 20px', height: 80, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div
                style={{
                    fontSize: 28,
                    color: '#fff',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    lineHeight: '80px',
                }}
                onClick={() => navigate('/books')}
            >
                <Space size={15}>
                    <Image
                        src={'/logo.jpg'}
                        alt={'logo'}
                        height={80}
                        preview={false}
                    />
                    Avant-grade bookstore
                </Space>
            </div>

            <div style={{ cursor: 'pointer' }} onClick={() => navigate('/profile')}>
                {userInfo && <Avatar size={40} src = {userInfo.avatar} />}
            </div>
        </Header>
    );
};

export default HeaderComponent;