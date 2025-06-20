import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { login } from '../service/loginService';
import { setUserId, setUserRole } from '../utils/ID-Storage';

const LoginChart = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onFinish = async (values) => {
        try {
            setLoading(true);
            console.log('开始登录，参数:', values);
            const response = await login(values);
            console.log('登录响应:', response);

            if (response.loginStatus === 'success') {
                // 存储用户ID和角色
                setUserId(response.id);
                setUserRole(response.status || 'BASIC'); // 默认为普通用户
                
                message.success(response.message || '登录成功');
                console.log('登录成功，用户角色:', response.status || 'BASIC');
                
                // 根据角色跳转到不同页面
                if (response.status === 'SUPER') {
                    navigate('/manager/home');
                } else {
                    navigate('/books');
                }
            } else {
                alert('登录失败！');
            }
        } catch (error) {
            console.error('登录过程发生错误:', error);
            alert('登录失败！'+error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: 300, margin: '0 auto' }}>
            <Form
                name="login"
                onFinish={onFinish}
            >
                <Form.Item
                    name="username"
                    rules={[{ required: true, message: '请输入用户名' }]}
                >
                    <Input 
                        prefix={<UserOutlined />} 
                        placeholder="用户名" 
                        size="large"
                    />
                </Form.Item>

                <Form.Item
                    name="password"
                    rules={[{ required: true, message: '请输入密码' }]}
                >
                    <Input.Password
                        prefix={<LockOutlined />}
                        placeholder="密码"
                        size="large"
                    />
                </Form.Item>

                <Form.Item>
                    <Button 
                        type="primary" 
                        htmlType="submit" 
                        loading={loading}
                        style={{ width: '100%' }}
                        size="large"
                    >
                        登录
                    </Button>
                </Form.Item>
            </Form>
            <Button 
                type="link" 
                onClick={() => navigate('/sign')}
                style={{ width: '100%' }}
            >
                还没有账号？立即注册
            </Button>
        </div>
    );
};

export default LoginChart;
