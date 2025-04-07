import React from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "../components/login_chart";

export default function LoginPage() {
    const navigate = useNavigate();
    const styles = {
        container: {
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            height: "100vh",
            backgroundImage: "url('/page-login.webp')",  // 放在 public 文件夹
            backgroundSize: "cover",
            backgroundPosition: "center",
            paddingRight: "10vw",
        },
        loginBox: {
            width: 420,
            padding: "40px 30px",
            background: "rgba(255, 255, 255, 0.7)", // 半透明白色背景
            borderRadius: 12,
            boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
            backdropFilter: "blur(8px)", // 背景模糊
            border: "1px solid rgba(255,255,255,0.3)"
        },
        title: {
            textAlign: "center",
            marginBottom: 30,
            fontSize: 28,
            color: "#333",
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

    const handleLogin = (username, password) => {
        if (username === "admin" && password === "123456") {
            navigate("/books");
        } else {
            alert("用户名或密码错误！");
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.leftPanel}>
                <h1>Welcome to Avant-grade Bookstore!</h1>
                <p>开启你的阅读之旅!</p>
            </div>
            <div style={styles.loginBox}>
                <h2 style={{ textAlign: "center",fontSize:30}}>登录</h2>
                <LoginForm onLogin={handleLogin} />
            </div>
        </div>
    );
}

