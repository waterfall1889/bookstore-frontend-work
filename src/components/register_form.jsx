import React from 'react';
import { Form, Input, Button, Typography, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined, ProfileOutlined } from '@ant-design/icons';
import { useNavigate } from "react-router-dom";
import { registerUser } from '../service/RegisterService';

const { Title } = Typography;
const { TextArea } = Input;

const RegisterForm = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [loading, setLoading] = React.useState(false);

    const switchToLogin = () => {
        navigate('/login');
    };

    const handleSubmit = async (values) => {
        try {
            setLoading(true);
            await registerUser(values);
            message.success('注册成功！');
            navigate('/login');
        } catch (error) {
            // 检查是否用户名已存在
            if (error.message && error.message.includes('用户名已存在')) {
                alert('用户名已存在，请更换用户名！');
            } else {
                message.error(error.message || '注册失败，请重试');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <Title level={2}>用户注册</Title>
            </div>
            
            <Form
                form={form}
                name="register"
                onFinish={handleSubmit}
                scrollToFirstError
                initialValues={{
                    username: '',
                    email: '',
                    phone: '',
                    password: '',
                    confirm: '',
                    description: ''
                }}
            >
                <Form.Item
                    name="username"
                    rules={[
                        {
                            required: true,
                            message: '请输入用户名！',
                        },
                        {
                            min: 1,
                            max: 16,
                            message: '用户名长度应为1-16个字符！',
                        },
                    ]}
                >
                    <Input 
                        prefix={<UserOutlined />} 
                        placeholder="用户名" 
                        size="large"
                    />
                </Form.Item>

                <Form.Item
                    name="email"
                    rules={[
                        {
                            required: true,
                            message: '请输入邮箱！',
                        },
                        {
                            type: 'email',
                            message: '请输入有效的邮箱地址！',
                        },
                        {
                            max: 40,
                            message: '邮箱长度不能超过40个字符！',
                        },
                    ]}
                >
                    <Input 
                        prefix={<MailOutlined />} 
                        placeholder="邮箱" 
                        size="large"
                    />
                </Form.Item>

                <Form.Item
                    name="phone"
                    rules={[
                        {
                            required: true,
                            message: '请输入手机号码！',
                        },
                        {
                            min: 6,
                            max: 13,
                            message: '电话号码长度应为6-13位！',
                        },
                    ]}
                >
                    <Input 
                        prefix={<PhoneOutlined />} 
                        placeholder="手机号码" 
                        size="large"
                    />
                </Form.Item>

                <Form.Item
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: '请输入密码！',
                        },
                        {
                            min: 8,
                            max: 16,
                            message: '密码长度应为8-16位！',
                        },
                    ]}
                    hasFeedback
                >
                    <Input.Password 
                        prefix={<LockOutlined />} 
                        placeholder="密码" 
                        size="large"
                    />
                </Form.Item>

                <Form.Item
                    name="confirm"
                    dependencies={['password']}
                    hasFeedback
                    rules={[
                        {
                            required: true,
                            message: '请确认密码！',
                        },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('两次输入的密码不一致！'));
                            },
                        }),
                    ]}
                >
                    <Input.Password 
                        prefix={<LockOutlined />} 
                        placeholder="确认密码" 
                        size="large"
                    />
                </Form.Item>

                <Form.Item
                    name="description"
                    rules={[
                        {
                            max: 200,
                            message: '个人描述不能超过200字！',
                        },
                    ]}
                >
                    <TextArea 
                        prefix={<ProfileOutlined />} 
                        placeholder="个人描述（选填）" 
                        autoSize={{ minRows: 3, maxRows: 6 }}
                        style={{ resize: 'none' }}
                    />
                </Form.Item>

                <Form.Item>
                    <Button 
                        type="primary" 
                        htmlType="submit" 
                        size="large"
                        block
                        loading={loading}
                    >
                        注册
                    </Button>
                </Form.Item>

                <div style={{ textAlign: 'center' }}>
                    <Button 
                        type="link" 
                        onClick={switchToLogin}
                    >
                        已有账号？立即登录
                    </Button>
                </div>
            </Form>
        </div>
    );
};

export default RegisterForm; 