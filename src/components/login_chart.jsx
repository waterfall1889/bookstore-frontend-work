// src/components/LoginForm.jsx
// 登录界面框
import React from "react";
import {Form, Input, Button, Checkbox} from "antd";

// 使用ant design 完成设计登录框
export default function LoginForm({ onLogin }) {
    const onFinish = (values) => {
        const { username, password } = values;
        onLogin(username, password);
    };

    return (
        <Form
            name="login"
            onFinish={onFinish}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 400, margin: "0 auto" }}
        >
            <Form.Item
                label="用户名"
                name="username"
                rules={[{ required: true, message: "请输入用户名" }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="密码"
                name="password"
                rules={[{ required: true, message: "请输入密码" }]}
            >
                <Input.Password />
            </Form.Item>

            <Form.Item name="remember" valuePropName="checked" label={null}>
                <Checkbox>记住密码</Checkbox>
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
                <Button type="primary" htmlType="submit" block>
                    登录
                </Button>
            </Form.Item>
        </Form>
    );
}
