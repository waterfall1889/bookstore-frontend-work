import React from 'react';
import { Menu } from 'antd';
import {
    BookOutlined,
    ShoppingCartOutlined,
    UnorderedListOutlined,
    UserOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import {clearUserId} from "../utils/ID-Storage";

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // 根据当前路径设置选中项
    const selectedKey = (() => {
        if (location.pathname.startsWith('/profile')) return 'profile';
        if (location.pathname.startsWith('/books')) return 'books';
        if (location.pathname.startsWith('/cart')) return 'cart';
        if (location.pathname.startsWith('/orders')) return 'orders';
        return '';
    })();

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
                    onClick: () => { navigate('/login');clearUserId(); }
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

export default Sidebar;

