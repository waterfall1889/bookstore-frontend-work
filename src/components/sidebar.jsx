import React from 'react';
import { Menu } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    BookOutlined,
    ShoppingCartOutlined,
    UnorderedListOutlined,
    UserOutlined,
    BarChartOutlined,
    ApiOutlined,
    MessageOutlined
} from '@ant-design/icons';
import { clearUserInfo, getUserId } from '../utils/ID-Storage';
import { logout } from '../service/logoutService';

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // 根据当前路径设置选中项
    const selectedKey = (() => {
        if (location.pathname.startsWith('/profile')) return 'profile';
        if (location.pathname.startsWith('/books')) return 'books';
        if (location.pathname.startsWith('/cart')) return 'cart';
        if (location.pathname.startsWith('/orders')) return 'orders';
        if (location.pathname.startsWith('/author-lookup')) return 'authorLookup';
        if (location.pathname.startsWith('/chatbot')) return 'chatbot';
        return '';
    })();

    const handleLogout = async () => {
        try {
            const userId = getUserId();
            if (!userId) {
                alert('用户信息获取失败');
                clearUserInfo();
                navigate('/');
                return;
            }

            const response = await logout(userId);
            
            // 使用 alert 显示会话时长信息
            alert(`${response.message}\n本次会话时长：${response.sessionTimeFormatted}`);
            
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
            alert('登出失败：' + error.message);
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
                    key: 'profile',
                    label: '个人资料',
                    onClick: () => { navigate('/profile'); }
                },
                {
                    key: 'logout',
                    label: '退出登录',
                    onClick: handleLogout
                }
            ]
        },
        {
            key: 'microservices',
            icon: <ApiOutlined />,
            label: '微服务体验',
            children: [
                {
                    key: 'authorLookup',
                    label: '作者查询',
                    onClick: () => { navigate('/author-lookup'); }
                },
                {
                    key: 'chatbot',
                    label: '智能助手',
                    onClick: () => { navigate('/chatbot'); }
                }
            ]
        },
        {
            key: 'books',
            icon: <BookOutlined />,
            label: '图书列表',
            onClick: () => { navigate('/books'); }
        },
        {
            key: 'cart',
            icon: <ShoppingCartOutlined />,
            label: '我的购物车',
            onClick: () => { navigate('/cart'); }
        },
        {
            key: 'orders',
            icon: <UnorderedListOutlined />,
            label: '我的订单',
            onClick: () => { navigate('/orders'); }
        },
        {
            key: 'charts',
            icon: <BarChartOutlined />,
            label: '数据统计',
            onClick: () => { navigate('/chart'); }
        },
    ];

    return (
        <Menu
            mode="inline"
            selectedKeys={[selectedKey]}
            defaultOpenKeys={['sub1', 'microservices']}
            style={{ height: '100%', borderRight: 0 }}
            items={sideMenuItems}
        />
    );
};

export default Sidebar;