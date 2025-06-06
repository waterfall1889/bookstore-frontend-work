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
                email: data.email,
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
            user_email: values.email,
            description: values.self_description,
            avatar_url: avatarUrl
        };
        try {
            await updateProfileService(userId, requestBody);
            message.success('信息修改保存成功！');
            navigate('/profile');
        } catch (err) {
            message.error('保存失败: ' + err.message);
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

                <Form.Item label="邮箱" name="email" rules={[{ required: true, message: '请输入邮箱！' }]}>
                    <Input />
                </Form.Item>

                <Form.Item label="个人说明" name="self_description">
                    <Input.TextArea rows={4} />
                </Form.Item>

                <Form.Item wrapperCol={{ offset: 4, span: 10 }}>
                    <Button type="primary" htmlType="submit">保存修改</Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default Profile_editor;
