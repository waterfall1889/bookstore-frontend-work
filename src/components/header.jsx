import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from 'antd/es/layout/layout';
import {BookOutlined, UserOutlined} from '@ant-design/icons';
import {Avatar, Image, Space} from 'antd';

const HeaderComponent = () => {
    const navigate = useNavigate();

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
                <Avatar size={40} src = '/head.jpg' />
            </div>
        </Header>
    );
};

export default HeaderComponent;
