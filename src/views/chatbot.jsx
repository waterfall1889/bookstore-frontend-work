import React, { useState, useRef, useEffect } from 'react';
import { Layout, Input, Button, List, Avatar, Spin, message } from 'antd';
import { SendOutlined, UserOutlined, RobotOutlined, CommentOutlined } from '@ant-design/icons';
import BasicLayout from '../components/layout';
import { sendChatMessage, checkChatbotHealth } from '../service/chatbotService';
import '../css/Chatbot.css';

const { Content } = Layout;
const { TextArea } = Input;

export default function ChatbotPage() {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [serviceAvailable, setServiceAvailable] = useState(true);
    const messagesEndRef = useRef(null);
    const chatContainerRef = useRef(null);

    // 初始化欢迎消息
    useEffect(() => {
        setMessages([
            {
                role: 'assistant',
                content: '您好！我是书店助手，可以帮助您搜索和查询图书信息。有什么可以帮您的吗？',
                timestamp: new Date()
            }
        ]);
        
        // 检查服务健康状态
        checkChatbotHealth().then(result => {
            if (result.status !== 'healthy' || result.chatbot_service !== 'available') {
                setServiceAvailable(false);
                message.warning('聊天服务暂时不可用，请确保聊天服务正在运行');
            }
        });
    }, []);

    // 自动滚动到底部
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSendMessage = async () => {
        if (!inputMessage.trim() || loading) {
            return;
        }

        const userMessage = {
            role: 'user',
            content: inputMessage.trim(),
            timestamp: new Date()
        };

        // 添加用户消息到列表
        setMessages(prev => [...prev, userMessage]);
        setInputMessage('');
        setLoading(true);

        try {
            // 构建历史记录（只包含最近的消息，避免token过多）
            const recentHistory = messages.slice(-10).map(msg => ({
                role: msg.role,
                content: msg.content
            }));

            // 调用聊天服务
            const response = await sendChatMessage(userMessage.content, recentHistory);

            // 添加助手回复
            const assistantMessage = {
                role: 'assistant',
                content: response.response || '抱歉，我没有收到回复。',
                timestamp: new Date()
            };

            setMessages(prev => [...prev, assistantMessage]);
            setServiceAvailable(true);
        } catch (error) {
            console.error('发送消息失败:', error);
            message.error(error.message || '发送消息失败，请稍后重试');
            
            const errorMessage = {
                role: 'assistant',
                content: `抱歉，发生错误：${error.message || '服务暂时不可用，请稍后重试'}`,
                timestamp: new Date(),
                isError: true
            };
            setMessages(prev => [...prev, errorMessage]);
            setServiceAvailable(false);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <BasicLayout>
            <Content className="chatbot-content">
                <div className="chatbot-card">
                    {/* 聊天头部 */}
                    <div style={{
                        padding: '20px 24px',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        borderBottom: 'none',
                        flexShrink: 0
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <Avatar 
                                size={40}
                                icon={<RobotOutlined />}
                                style={{
                                    background: 'rgba(255, 255, 255, 0.2)',
                                    border: '2px solid rgba(255, 255, 255, 0.3)'
                                }}
                            />
                            <div>
                                <div style={{ 
                                    fontSize: '18px', 
                                    fontWeight: '600',
                                    lineHeight: '1.2'
                                }}>
                                    智能书店助手
                                </div>
                                <div style={{ 
                                    fontSize: '12px', 
                                    opacity: 0.9,
                                    marginTop: '2px'
                                }}>
                                    {serviceAvailable ? '在线 • 随时为您服务' : '离线 • 服务不可用'}
                                </div>
                            </div>
                        </div>
                    </div>

                    {!serviceAvailable && (
                        <div className="service-warning">
                            <span>⚠️ 聊天服务可能不可用，请确保聊天服务正在运行</span>
                        </div>
                    )}
                    
                    <div className="chatbot-messages" ref={chatContainerRef}>
                        {messages.length === 0 && (
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: '100%',
                                color: '#999',
                                textAlign: 'center',
                                padding: '40px 20px'
                            }}>
                                <CommentOutlined style={{ fontSize: '64px', marginBottom: '20px', opacity: 0.3 }} />
                                <div style={{ fontSize: '18px', fontWeight: '500', marginBottom: '8px' }}>
                                    开始对话
                                </div>
                                <div style={{ fontSize: '14px', opacity: 0.7 }}>
                                    我是您的书店助手，可以帮助您搜索和查询图书信息
                                </div>
                            </div>
                        )}
                        <List
                            dataSource={messages}
                            renderItem={(msg, index) => (
                                <List.Item key={index} className={`message-item ${msg.role}`}>
                                    <div className={`message-bubble ${msg.role} ${msg.isError ? 'error' : ''}`}>
                                        <div className="message-header">
                                            <Avatar 
                                                size={36}
                                                icon={msg.role === 'user' ? <UserOutlined /> : <RobotOutlined />}
                                                style={{
                                                    backgroundColor: msg.role === 'user' 
                                                        ? 'rgba(255, 255, 255, 0.3)' 
                                                        : '#667eea',
                                                    border: msg.role === 'user' 
                                                        ? '2px solid rgba(255, 255, 255, 0.5)' 
                                                        : '2px solid #e0e0e0',
                                                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                                                }}
                                            />
                                            <span className="message-role">
                                                {msg.role === 'user' ? '您' : '智能助手'}
                                            </span>
                                            <span className="message-time">
                                                {msg.timestamp.toLocaleTimeString('zh-CN', { 
                                                    hour: '2-digit', 
                                                    minute: '2-digit' 
                                                })}
                                            </span>
                                        </div>
                                        <div className="message-content">
                                            {msg.content.split('\n').map((line, i) => (
                                                <div key={i}>{line}</div>
                                            ))}
                                        </div>
                                    </div>
                                </List.Item>
                            )}
                        />
                        {loading && (
                            <div className="message-item assistant">
                                <div className="message-bubble assistant loading">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <Spin size="small" />
                                        <span>正在思考中...</span>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="chatbot-input-area">
                        <TextArea
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="输入您的问题，按Enter发送，Shift+Enter换行..."
                            autoSize={{ minRows: 1, maxRows: 4 }}
                            disabled={loading}
                            className="chatbot-textarea"
                        />
                        <Button
                            type="primary"
                            icon={<SendOutlined />}
                            onClick={handleSendMessage}
                            loading={loading}
                            disabled={!inputMessage.trim() || loading}
                            className="chatbot-send-button"
                        >
                            发送
                        </Button>
                    </div>
                </div>
            </Content>
        </BasicLayout>
    );
}
