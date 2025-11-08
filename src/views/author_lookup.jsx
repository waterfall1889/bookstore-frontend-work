import React, { useState } from 'react';
import { Card, Input, List, Tag, Typography, Empty, message } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import BasicLayout from '../components/layout';
import { queryAuthorsByBookName } from '../service/authorLookupService';

const { Title, Text } = Typography;
const { Search } = Input;

const AuthorLookupPage = () => {
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState([]);
    const [lastQuery, setLastQuery] = useState('');

    const handleSearch = async (value) => {
        const keyword = value?.trim();
        if (!keyword) {
            message.warning('请输入书名后再查询');
            return;
        }
        setLoading(true);
        try {
            const data = await queryAuthorsByBookName(keyword);
            setResults(data.results || []);
            setLastQuery(data.query || keyword);
        } catch (error) {
            message.error(error.message || '查询失败，请稍后重试');
            setResults([]);
            setLastQuery(keyword);
        } finally {
            setLoading(false);
        }
    };

    return (
        <BasicLayout>
            <Card
                title="作者查询微服务"
                bordered={false}
                style={{ maxWidth: 720, margin: '0 auto' }}
            >
                <Title level={4}>按书名查询作者</Title>
                <Text type="secondary">
                    该功能通过 Gateway 调用作者查询微服务，实时读取后端数据库中的图书作者信息。
                </Text>

                <div style={{ margin: '24px 0' }}>
                    <Search
                        placeholder="请输入书名，例如 三体"
                        allowClear
                        enterButton={<SearchOutlined />}
                        size="large"
                        loading={loading}
                        onSearch={handleSearch}
                    />
                </div>

                {results.length > 0 ? (
                    <List
                        bordered
                        dataSource={results}
                        renderItem={(item) => (
                            <List.Item>
                                <div style={{ width: '100%' }}>
                                    <Title level={5} style={{ marginBottom: 8 }}>
                                        {item.bookName}
                                        <Text type="secondary" style={{ marginLeft: 12 }}>
                                            （ID: {item.itemId}）
                                        </Text>
                                    </Title>
                                    <div>
                                        {item.authors && item.authors.length > 0 ? (
                                            item.authors.map((author) => (
                                                <Tag color="blue" key={`${item.itemId}-${author}`}>
                                                    {author}
                                                </Tag>
                                            ))
                                        ) : (
                                            <Text type="secondary">暂无作者信息</Text>
                                        )}
                                    </div>
                                </div>
                            </List.Item>
                        )}
                    />
                ) : (
                    <Empty
                        description={
                            lastQuery
                                ? `未找到与 “${lastQuery}” 相符的作者信息`
                                : '请输入书名开始查询'
                        }
                    />
                )}
            </Card>
        </BasicLayout>
    );
};

export default AuthorLookupPage;

