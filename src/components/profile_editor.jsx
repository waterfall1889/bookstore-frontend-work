import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, Button, Form, Input, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const Profile_editor = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [avatarUrl, setAvatarUrl] = useState(null);

    const onFinish = (values) => {
        console.log('表单提交成功:', values);
        alert('信息修改保存成功！');
        navigate('/profile');
    };

    // 模拟上传头像并预览
    const handleBeforeUpload = (file) => {
        const isImage = file.type.startsWith('image/');
        if (!isImage) {
            message.error('只能上传图片文件！');
            return false;
        }

        const reader = new FileReader();
        reader.onload = () => {
            setAvatarUrl(reader.result); // 设置预览 URL
        };
        reader.readAsDataURL(file);

        return false; // 阻止自动上传
    };

    return (
        <div style={{ padding: '40px 20px', maxWidth: 800 }}>
            <h2 style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 32 }}>修改个人信息</h2>
            <Form
                form={form}
                name="profile-edit"
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 10 }}
                initialValues={{
                    username: 'admin',
                    password: '123456',
                    password2: '123456',
                    email: 'admin@example.com',
                    self_description : '这是一个测试用户，未来将通过后端导入信息。',
                }}
                onFinish={onFinish}
                autoComplete="off"
            >
                <Form.Item label="头像">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                        <Avatar
                            size={80}
                            src={avatarUrl ||'/head.jpg'}
                        />
                        <Upload
                            showUploadList={false}
                            beforeUpload={handleBeforeUpload}
                        >
                            <Button icon={<UploadOutlined />}>上传头像</Button>
                        </Upload>
                    </div>
                </Form.Item>

                <Form.Item
                    label="用户名"
                    name="username"
                    rules={[{ required: true, message: '请输入用户名！' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="密码"
                    name="password"
                    rules={[{ required: true, message: '请输入密码！' }]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    label="重复密码"
                    name="password2"
                    dependencies={['password']}
                    rules={[
                        { required: true, message: '请再次输入密码！' },
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
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    label="邮箱"
                    name="email"
                    rules={[{ required: true, message: '请输入邮箱！' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="个人说明"
                    name="self_description"
                >
                    <Input />
                </Form.Item>

                <Form.Item wrapperCol={{ offset: 4, span: 10 }}>
                    <Button type="primary" htmlType="submit">
                        保存修改
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default Profile_editor;
