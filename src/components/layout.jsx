import React from 'react';
import { Layout, theme } from 'antd';
import HeaderComponent from './header';
import Sidebar from './sidebar';

const { Content, Sider } = Layout;

const BasicLayout = ({ children }) => {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    return (
        <Layout style={{ minHeight: '100vh' }}>
            {/* 引入 Header 组件 */}
            <HeaderComponent />

            <Layout>
                {/* 引入 Sidebar 组件 */}
                <Sider width={200} style={{ background: colorBgContainer }}>
                    <Sidebar />
                </Sider>

                <Layout style={{ padding: '0 24px 24px' }}>
                    <Content
                        style={{
                            padding: 24,
                            margin: 0,
                            minHeight: 280,
                            background: colorBgContainer,
                            borderRadius: borderRadiusLG,
                        }}
                    >
                        {children}
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    );
};

export default BasicLayout;
