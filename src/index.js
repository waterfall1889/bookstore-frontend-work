import React from 'react';
import ReactDOM from 'react-dom/client';
import '../../bookstore/src/css/index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'antd/dist/reset.css'; // 最新版本推荐用 reset.css

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
