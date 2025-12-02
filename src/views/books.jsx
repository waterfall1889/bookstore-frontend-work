import React, { useState, useEffect } from 'react';
import { Row, Col, Input, Button, message, Spin, Tag, Space, Divider } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { fetchAllBooks } from '../service/bookcardService';
import { searchBooks } from '../service/SearchService';
import { searchBooksByTag, getAllTags } from '../service/TagSearchService';
import BasicLayout from '../components/layout';
import Book_card from '../components/book_card';

const { Search } = Input;

const BookPage = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchLoading, setSearchLoading] = useState(false);
    const [tags, setTags] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [tagsLoading, setTagsLoading] = useState(false);
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
        loadTags();
    }, []);

    const loadTags = async () => {
        try {
            setTagsLoading(true);
            const data = await getAllTags();
            setTags(data);
        } catch (error) {
            console.error('加载标签列表失败:', error);
        } finally {
            setTagsLoading(false);
        }
    };

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

    const handleTagClick = async (tagName) => {
        try {
            setSearchLoading(true);
            const searchResults = await searchBooksByTag(tagName);
            if (searchResults && searchResults.length > 0) {
                setBooks(searchResults);
                // 更新选中的标签
                if (!selectedTags.includes(tagName)) {
                    setSelectedTags([...selectedTags, tagName]);
                }
                message.success(`找到 ${searchResults.length} 本相关图书`);
            } else {
                message.warning('未找到相关图书');
                setBooks([]);
            }
        } catch (error) {
            message.error('标签搜索失败：' + error.message);
            setBooks([]);
        } finally {
            setSearchLoading(false);
        }
    };

    const handleTagClose = (tagName) => {
        const newSelectedTags = selectedTags.filter(t => t !== tagName);
        setSelectedTags(newSelectedTags);
        if (newSelectedTags.length === 0) {
            loadAllBooks();
        } else {
            // 如果还有选中的标签，重新搜索
            handleTagClick(newSelectedTags[0]);
        }
    };

    const clearTagFilters = () => {
        setSelectedTags([]);
        loadAllBooks();
    };

    if (loading) {
        return (
            <BasicLayout>
                <div style={{ textAlign: 'center', padding: '50px' }}>
                    <Spin size="large" />
                </div>
            </BasicLayout>
        );
    }

    return (
        <BasicLayout>
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

                <Divider orientation="left">按标签搜索</Divider>
                
                {selectedTags.length > 0 && (
                    <div style={{ marginBottom: 16 }}>
                        <Space wrap>
                            <span>已选标签：</span>
                            {selectedTags.map(tag => (
                                <Tag
                                    key={tag}
                                    closable
                                    onClose={() => handleTagClose(tag)}
                                    color="blue"
                                >
                                    {tag}
                                </Tag>
                            ))}
                            <Button size="small" onClick={clearTagFilters}>
                                清除所有
                            </Button>
                        </Space>
                    </div>
                )}

                <div style={{ marginBottom: 24 }}>
                    {tagsLoading ? (
                        <Spin />
                    ) : (
                        <Space wrap>
                            {tags.map(tag => (
                                <Tag
                                    key={tag.tagId}
                                    onClick={() => handleTagClick(tag.tagName)}
                                    style={{
                                        cursor: 'pointer',
                                        padding: '4px 12px',
                                        fontSize: '14px',
                                        marginBottom: '8px'
                                    }}
                                    color={selectedTags.includes(tag.tagName) ? 'blue' : 'default'}
                                >
                                    {tag.tagName}
                                </Tag>
                            ))}
                        </Space>
                    )}
                </div>

                <Divider />

                <Row gutter={[24, 24]} justify="start">
                    {books.map(book => (
                        <Col xs={24} sm={12} md={8} lg={6} key={book.itemId}>
                            <Book_card book={book} EditButton={false}/>
                        </Col>
                    ))}
                </Row>

                {books.length === 0 && !loading && !searchLoading && (
                    <div style={{ textAlign: 'center', padding: '50px' }}>
                        <p>暂无图书</p>
                    </div>
                )}
            </div>
        </BasicLayout>
    );
};

export default BookPage;
