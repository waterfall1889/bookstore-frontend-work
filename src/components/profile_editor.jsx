import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, Button, Form, Input, message } from 'antd';
import { fetchInitialProfile } from '../service/InitialProfileService';
import { getUserId } from '../utils/ID-Storage';
import {updateProfileService} from "../service/updateProfileService";

const Profile_editor = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();

    const [avatarUrl, setAvatarUrl] = useState(null);

    const userId = getUserId();

    useEffect(() => {
        fetchInitialProfile(userId).then((data) => {
            form.setFieldsValue({
                username: data.user_name,
                password: data.password,
                password2: data.password,
                email: data.user_email,
                self_description: data.description,
            });
            setAvatarUrl(data.avatar_url);
        }).catch((error) => {
            message.error('加载用户信息失败: ' + error.message);
        });
    }, [form]);

    const onFinish = async (values) => {
        const requestBody = {
            user_id: userId,
            user_name: values.username,
            password: values.password,
            user_email: values.email,
            description: values.self_description,
            avatar_url: avatarUrl
        };
        try {
            await updateProfileService(userId, requestBody);
            alert('信息修改保存成功！');
            navigate('/profile');
        } catch (err) {
            alert('保存失败: ' + err.message);
        }
    };


    return (
        <div style={{ padding: '40px 20px', maxWidth: 800 }}>
            <h2 style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 32 }}>修改个人信息</h2>
            <Form
                form={form}
                name="profile-edit"
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 10 }}
                onFinish={onFinish}
                autoComplete="off"
            >
                <Form.Item label="头像">
                    <Avatar size={80} src={avatarUrl} />
                </Form.Item>

                <Form.Item label="用户名" name="username" rules={[{ required: true, message: '请输入用户名！' }]}>
                    <Input />
                </Form.Item>

                <Form.Item label="密码" name="password" rules={[{ required: true, message: '请输入密码！' }]}>
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

                <Form.Item label="邮箱" name="email" rules={[{ required: true, message: '请输入邮箱！' }]}>
                    <Input />
                </Form.Item>

                <Form.Item label="个人说明" name="self_description">
                    <Input />
                </Form.Item>

                <Form.Item wrapperCol={{ offset: 4, span: 10 }}>
                    <Button type="primary" htmlType="submit">保存修改</Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default Profile_editor;
