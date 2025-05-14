import React from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "../components/login_chart.jsx";

const LoginPage = () => {
    const navigate = useNavigate();

    const handleLoginSuccess = (result) => {
        try {
            console.log("登陆成功，准备跳转到书籍列表页面");  // 添加日志
            navigate("/books");
        }
        catch (error) {
            console.error("处理登录成功回调时发生错误:", error);  // 添加错误日志
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.leftPanel}>
                <h1>Welcome to Avant-grade Bookstore!</h1>
                <p>开启你的阅读之旅!</p>
            </div>
            <div style={styles.loginBox}>
                <h2 style={{ textAlign: "center", fontSize: 30 }}>登录</h2>
                {/* 将 handleLoginSuccess 传递给 LoginForm 作为 onLoginSuccess 回调 */}
                <LoginForm onLoginSuccess={handleLoginSuccess} />
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        height: "100vh",
        backgroundImage: "url('/page-login.webp')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        paddingRight: "10vw",
    },
    loginBox: {
        width: 420,
        padding: "40px 30px",
        background: "rgba(255, 255, 255, 0.7)",
        borderRadius: 12,
        boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
        backdropFilter: "blur(8px)",
        border: "1px solid rgba(255,255,255,0.3)"
    },
    leftPanel: {
        color: "white",
        maxWidth: 700,
        padding: "20px",
        fontSize: 24,
        fontWeight: "bold",
        textShadow: "0 2px 4px rgba(0,0,0,0.5)",
    },
};

export default LoginPage;
