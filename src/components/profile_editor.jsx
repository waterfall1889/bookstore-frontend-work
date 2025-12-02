import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, Button, Form, Input, message, Upload } from 'antd';
import { UserOutlined, UploadOutlined } from '@ant-design/icons';
import { fetchInitialProfile } from '../service/InitialProfileService';
import { getUserId } from '../utils/ID-Storage';
import { updateProfileService } from "../service/updateProfileService";
import { uploadAvatar, getAvatarUrl } from '../service/avatarService';

const Profile_editor = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [avatarUrl, setAvatarUrl] = useState(null);
    const [avatarFile, setAvatarFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const userId = getUserId();

    useEffect(() => {
        fetchInitialProfile(userId).then((data) => {
            form.setFieldsValue({
                username: data.user_name,
                email: data.email,
                self_description: data.description,
            });
            // 如果avatar_url是MongoDB的URL，直接使用；否则使用默认头像
            if (data.avatar_url && data.avatar_url.startsWith('/api/avatar/')) {
                setAvatarUrl(`http://localhost:8080${data.avatar_url}`);
            } else if (data.avatar_url) {
                setAvatarUrl(data.avatar_url);
            } else {
                setAvatarUrl(getAvatarUrl(userId));
            }
        }).catch((error) => {
            message.error('加载用户信息失败: ' + error.message);
        });
    }, [form, userId]);

    const handleAvatarChange = async (info) => {
        const { file } = info;
        
        if (file.status === 'uploading') {
            setUploading(true);
            return;
        }
        
        if (file.status === 'done' || file.originFileObj) {
            try {
                setUploading(true);
                const fileToUpload = file.originFileObj || file;
                const result = await uploadAvatar(userId, fileToUpload);
                
                // 更新头像URL
                const newAvatarUrl = `http://localhost:8080${result.avatarUrl}`;
                setAvatarUrl(newAvatarUrl);
                setAvatarFile(null);
                
                message.success('头像上传成功！');
            } catch (error) {
                message.error('头像上传失败: ' + error.message);
            } finally {
                setUploading(false);
            }
        }
        
        if (file.status === 'error') {
            message.error('头像上传失败');
            setUploading(false);
        }
    };

    const beforeUpload = (file) => {
        const isImage = file.type.startsWith('image/');
        if (!isImage) {
            message.error('只能上传图片文件!');
            return false;
        }
        const isLt5M = file.size / 1024 / 1024 < 5;
        if (!isLt5M) {
            message.error('图片大小不能超过5MB!');
            return false;
        }
        return true;
    };

    const onFinish = async (values) => {
        // 如果上传了新头像，头像URL已经在handleAvatarChange中更新
        const requestBody = {
            user_id: userId,
            user_name: values.username,
            user_email: values.email,
            description: values.self_description,
            avatar_url: avatarUrl ? avatarUrl.replace('http://localhost:8080', '') : null
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <Avatar 
                            size={80} 
                            src={avatarUrl || getAvatarUrl(userId)} 
                            icon={!avatarUrl && <UserOutlined />}
                        />
                        <Upload
                            name="avatar"
                            showUploadList={false}
                            beforeUpload={beforeUpload}
                            customRequest={({ file, onSuccess, onError }) => {
                                handleAvatarChange({ file: { ...file, status: 'uploading' } });
                                uploadAvatar(userId, file)
                                    .then((result) => {
                                        const newAvatarUrl = `http://localhost:8080${result.avatarUrl}`;
                                        setAvatarUrl(newAvatarUrl);
                                        handleAvatarChange({ file: { ...file, status: 'done' } });
                                        onSuccess(result);
                                    })
                                    .catch((error) => {
                                        handleAvatarChange({ file: { ...file, status: 'error' } });
                                        onError(error);
                                    });
                            }}
                            accept="image/*"
                        >
                            <Button 
                                icon={<UploadOutlined />} 
                                loading={uploading}
                                disabled={uploading}
                            >
                                {uploading ? '上传中...' : '上传头像'}
                            </Button>
                        </Upload>
                    </div>
                    <div style={{ marginTop: 8, color: '#999', fontSize: '12px' }}>
                        支持 JPG、PNG、GIF、WebP 格式，最大 5MB
                    </div>
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
