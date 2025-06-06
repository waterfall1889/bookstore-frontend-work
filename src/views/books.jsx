import React, { useState, useEffect } from 'react';
import { Row, Col, message } from 'antd';
import BasicLayout from '../components/layout';
import Search from '../components/search';
import Book_card from '../components/book_card';
import BookPagination from '../components/pagination';
import Advertisement from '../components/book_advertisement';
import { fetchAllBooks } from '../service/bookcardService';

export default function BookPage() {
    const [bookList, setBookList] = useState([]);

    useEffect(() => {
        fetchAllBooks()
            .then(data => {
                console.log("获取到的图书数据：", data);
                setBookList(data);
            })
            .catch(() => {
                message.error('加载书籍失败');
            });
    }, []);

    return (
        <BasicLayout>
            <div style={{ padding: '24px' }}>
                <Advertisement />
                <Search />

                <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
                    {bookList.map((book) => (
                        <Col key={book.item_id} xs={24} sm={12} md={8} lg={6}>
                            <Book_card book={book} />
                        </Col>
                    ))}
                </Row>
            </div>
        </BasicLayout>
    );
}
