import React from 'react';
import { Menu } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    BookOutlined,
    UnorderedListOutlined,
    UserOutlined,
    BarChartOutlined,
    TeamOutlined
} from '@ant-design/icons';
import { clearUserInfo } from '../utils/ID-Storage';

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
        return '';
    })();

    const sideMenuItems = [
        {
            key: 'sub1',
            icon: <UserOutlined />,
            label: '个人中心',
            children: [
                {
                    key: 'logout',
                    label: '退出登录',
                    onClick: () => { 
                        clearUserInfo();
                        navigate('/');
                    }
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