import React from 'react';
import { Menu, message } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    BookOutlined,
    UnorderedListOutlined,
    UserOutlined,
    BarChartOutlined,
    TeamOutlined
} from '@ant-design/icons';
import { clearUserInfo, getUserId } from '../utils/ID-Storage';
import { logout } from '../service/logoutService';

const ManagerSidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // 根据当前路径设置选中项
    const selectedKey = (() => {
        if (location.pathname.startsWith('/profile')) return 'profile';
        if (location.pathname.startsWith('/manager/books')) return 'books';
        if (location.pathname.startsWith('/manager/orders')) return 'orders';
        if (location.pathname.startsWith('/manager/charts')) return 'charts';
        if (location.pathname.startsWith('/manager/users')) return 'users';
        if (location.pathname.startsWith('/manager/add')) return 'add';
        return '';
    })();

    const handleLogout = async () => {
        try {
            const userId = getUserId();
            if (!userId) {
                message.error('用户信息获取失败');
                clearUserInfo();
                navigate('/');
                return;
            }

            const response = await logout(userId);

            // 显示登出成功信息和会话时长
            message.success(
                `${response.message}，本次会话时长：${response.sessionTimeFormatted}`,
                5 // 显示5秒
            );

            console.log('会话时长信息:', {
                duration: response.sessionDuration,
                minutes: response.sessionMinutes,
                seconds: response.sessionSeconds,
                formatted: response.sessionTimeFormatted
            });

            clearUserInfo();
            navigate('/');
        } catch (error) {
            console.error('登出失败:', error);
            message.error('登出失败：' + error.message);
            // 即使登出失败，也清除本地信息
            clearUserInfo();
            navigate('/');
        }
    };

    const sideMenuItems = [
        {
            key: 'sub1',
            icon: <UserOutlined />,
            label: '个人中心',
            children: [
                {
                    key: 'logout',
                    label: '退出登录',
                    onClick: handleLogout
                }
            ]
        },
        {
            key: 'books',
            icon: <BookOutlined />,
            label: '图书管理',
            onClick: () => { navigate('/manager/books'); }
        },
        {
            key: 'orders',
            icon: <UnorderedListOutlined />,
            label: '订单管理',
            onClick: () => { navigate('/manager/orders'); }
        },
        {
            key: 'charts',
            icon: <BarChartOutlined />,
            label: '数据统计',
            onClick: () => { navigate('/manager/charts'); }
        },
        {
            key: 'users',
            icon: <TeamOutlined />,
            label: '用户管理',
            onClick: () => { navigate('/manager/users'); }
        },
        {
            key: 'add',
            icon: <BookOutlined />,
            label: '添加书籍',
            onClick: () => { navigate('/manager/add'); }
        },
    ];

    return (
        <Menu
            mode="inline"
            selectedKeys={[selectedKey]}
            style={{ height: '100%', borderRight: 0 }}
            items={sideMenuItems}
        />
    );
};

export default ManagerSidebar;