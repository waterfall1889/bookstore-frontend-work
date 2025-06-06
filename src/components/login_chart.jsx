import React from "react";
import { Form, Input, Button, Checkbox, message } from "antd";
import { loginRequest } from "../service/loginService";
import {useNavigate} from "react-router-dom";


const LoginForm = ({ onLoginSuccess }) => {
    const [form] = Form.useForm();
    const navigator = useNavigate();

    const onFinish = async (values) => {
        const { username, password } = values;

        try {
            const result = await loginRequest(username, password);
            onLoginSuccess(result);
        }
        catch (error) {
            message.error("登录失败：" + error.message);  // 展示具体错误信息
            alert("帐号或密码有误：" + error.message);
        }
    };

    const onFinishFailed = (errorInfo) => {
        console.log("表单验证失败:", errorInfo);
    };

    // 添加按钮点击事件处理函数
    const handleClick = () => {
        console.log("按钮被点击了！");
        form.submit();  // 手动触发表单提交
    };

    return (
        <Form
            form={form}  // 绑定表单实例
            name="login"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
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

            <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
                <Button
                    type="primary"
                    htmlType="button"  // 改为button类型
                    block
                    onClick={handleClick}  // 添加点击事件处理
                >
                    登录
                </Button>
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
                <Button
                    type="primary"
                    htmlType="button"  // 改为button类型
                    block
                    onClick = {() =>navigator('/sign')} // 添加点击事件处理
                >
                    注册
                </Button>
            </Form.Item>
        </Form>
    );
};

export default LoginForm;
