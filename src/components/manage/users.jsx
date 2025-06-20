import React, { useState, useEffect } from 'react';
import { Table, Avatar, Tag, Button, message, Space } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { getUserList, updateUserStatus } from '../../service/UserService';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    const loadUsers = async () => {
        try {
            setLoading(true);
            const response = await getUserList();
            if (response.success) {
                setUsers(response.data);
            } else {
                message.error('获取用户列表失败');
            }
        } catch (error) {
            console.error('加载用户列表出错:', error);
            message.error('加载用户列表失败');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (userId, currentStatus) => {
        try {
            const newStatus = currentStatus === 1 ? 0 : 1;
            const response = await updateUserStatus(userId, newStatus);
            if (response.success) {
                message.success(`${newStatus === 1 ? '解禁' : '禁用'}用户成功`);
                loadUsers(); // 重新加载用户列表
            } else {
                message.error(response.message || '操作失败');
            }
        } catch (error) {
            console.error('更新用户状态出错:', error);
            message.error('操作失败');
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const columns = [
        {
            title: '头像',
            dataIndex: 'avatar',
            key: 'avatar',
            width: 80,
            render: (avatar) => (
                <Avatar 
                    src={avatar} 
                    icon={<UserOutlined />}
                    size={40}
                />
            ),
        },
        {
            title: '用户ID',
            dataIndex: 'id',
            key: 'id',
            width: 100,
        },
        {
            title: '用户名',
            dataIndex: 'username',
            key: 'username',
            width: 150,
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            width: 100,
            render: (status) => (
                <Tag color={status === 1 ? 'green' : 'red'}>
                    {status === 1 ? '正常' : '已禁用'}
                </Tag>
            ),
        },
        {
            title: '身份',
            dataIndex: 'role',
            key: 'role',
            width: 100,
            render: (role) => (
                <Tag color={role === 'SUPER' ? 'blue' : 'default'}>
                    {role === 'SUPER' ? '管理员' : '普通用户'}
                </Tag>
            ),
        },
        {
            title: '操作',
            key: 'action',
            width: 120,
            render: (_, record) => (
                <Space>
                    {record.role !== 'SUPER' && (
                        <Button
                            type={record.status === 1 ? 'danger' : 'primary'}
                            size="small"
                            onClick={() => handleStatusChange(record.id, record.status)}
                        >
                            {record.status === 1 ? '禁用' : '解禁'}
                        </Button>
                    )}
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: '24px' }}>
            <h2>用户管理</h2>
            <Table
                columns={columns}
                dataSource={users}
                rowKey="id"
                loading={loading}
                pagination={{
                    defaultPageSize: 10,
                    showSizeChanger: true,
                    showTotal: (total) => `共 ${total} 条记录`,
                }}
            />
        </div>
    );
};

export default UserManagement; 