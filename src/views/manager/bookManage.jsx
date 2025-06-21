import React, { useState, useEffect } from 'react';
import { Row, Col, Input, Button, message, Spin } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { fetchAllBooks } from '../../service/bookcardService';
import { searchBooks } from '../../service/SearchService';
import ManagerLayout from "../../components/manager_layout";
import Book_card from '../../components/book_card';

const { Search } = Input;

const ManagerBookPage = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchLoading, setSearchLoading] = useState(false);
    const navigate = useNavigate();

    const loadAllBooks = async () => {
        try {
            setLoading(true);
            const data = await fetchAllBooks();
            setBooks(data);
        } catch (error) {
            message.error('加载图书列表失败：' + error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAllBooks();
    }, []);

    const handleSearch = async (value) => {
        if (!value.trim()) {
            loadAllBooks();
            return;
        }

        try {
            setSearchLoading(true);
            const searchResults = await searchBooks(value);
            if (searchResults) {
                // 如果结果是单个对象，转换为数组
                const resultsArray = Array.isArray(searchResults) ? searchResults : [searchResults];
                console.log('处理后的搜索结果数量:', resultsArray.length);
                setBooks(resultsArray);
            } else {
                console.log('搜索结果为空');
                message.warning('未找到相关图书');
                setBooks([]);
            }
        } catch (error) {
            message.error('搜索失败：' + error.message);
            setBooks([]);
        } finally {
            setSearchLoading(false);
        }
    };

    if (loading) {
        return (
            <ManagerLayout>
                <div style={{ textAlign: 'center', padding: '50px' }}>
                    <Spin size="large" />
                </div>
            </ManagerLayout>
        );
    }

    return (
        <ManagerLayout>
            <div style={{ padding: '24px', maxWidth: 1200, margin: '0 auto' }}>
                <div style={{ marginBottom: 24 }}>
                    <Search
                        placeholder="请输入书名搜索"
                        allowClear
                        enterButton={<Button type="primary" icon={<SearchOutlined />}>搜索</Button>}
                        size="large"
                        onSearch={handleSearch}
                        loading={searchLoading}
                    />
                </div>

                <Row gutter={[24, 24]} justify="start">
                    {books.map(book => (
                        <Col xs={24} sm={12} md={8} lg={6} key={book.itemId}>
                            <Book_card book={book} showDetailButton={false} />
                        </Col>
                    ))}
                </Row>
            </div>
        </ManagerLayout>
    );
};

export default ManagerBookPage;