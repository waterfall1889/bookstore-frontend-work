import React from 'react';
import { Card } from 'antd';
import RegisterForm from '../components/register_form';
import { Header } from "antd/es/layout/layout";

const SignPage = () => {
    return (
        <div style={{ 
            minHeight: '100vh',
            background: '#ffffff',
            padding: '24px'
        }}>
            <Header style={{ 
                background: '#ffffff',
                padding: '0 24px',
                marginBottom: '24px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
            }}>
                <h1 style={{ margin: 0, lineHeight: '64px' }}>用户注册</h1>
            </Header>
            
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-start',
                padding: '24px'
            }}>
                <Card 
                    style={{ 
                        width: 500,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        borderRadius: '8px'
                    }}
                >
                    <RegisterForm />
                </Card>
            </div>
        </div>
    );
};

export default SignPage;