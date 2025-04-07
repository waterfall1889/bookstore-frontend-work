import React, { useState } from 'react';
import { Row, Col } from 'antd';
import BasicLayout from '../components/layout';
import Search from '../components/search';
import Book_card from '../components/book_card';
import BookPagination from "../components/pagination";
import Advertisement from "../components/book_advertisement";

export default function BookPage() {
    // 使用 useState 管理书籍列表
    const [bookList, setBookList] = useState([
        {
            bookname: "挪威的森林",
            author: "村上春树",
            price: "40",
            rate: 4.5,
            bookpicture: '/bookcovers/book1.jpg',
            id: 1
        },
        {
            bookname: "没有英雄的叙事诗",
            author: "安娜·阿赫玛托娃",
            price: "68",
            rate: 4.0,
            bookpicture: '/bookcovers/book2.jpg',
            id: 2
        },
        {
            bookname: "呐喊",
            author: "鲁迅",
            price: "38",
            rate: 5.0,
            bookpicture: '/bookcovers/book3.jpg',
            id: 3
        },
        {
            bookname: "都柏林人",
            author: "詹姆斯·乔伊斯",
            price: "28",
            rate: 3.5,
            bookpicture: '/bookcovers/book4.jpg',
            id: 4
        },
        {
            bookname: "1984",
            author: "乔治·奥威尔",
            price: "48",
            rate: 4.2,
            bookpicture: '/bookcovers/book5.jpg',
            id: 5
        },
        {
            bookname: "公羊的节日",
            author: "马里奥·巴尔加斯·略萨",
            price: "32",
            rate: 4.2,
            bookpicture: '/bookcovers/book6.png',
            id: 6
        },
        {
            bookname: "悲惨世界",
            author: "维克托·雨果",
            price: "60",
            rate: 4.9,
            bookpicture: '/bookcovers/book7.jpg',
            id: 7
        },
        {
            bookname: "世说新语",
            author: "刘义庆",
            price: "22",
            rate: 3.2,
            bookpicture: '/bookcovers/book8.jpg',
            id: 8
        }
    ]);

    return (
        <BasicLayout>
            <div style={{ padding: '24px' }}>
                <Advertisement />
                <Search />

                <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
                    {bookList.map((book) => (
                        <Col key={book.id} xs={24} sm={12} md={8} lg={6}>
                            <Book_card book={book} />
                        </Col>
                    ))}
                </Row>

                <div style={{ textAlign: 'center', marginTop: 24 }}>
                    <BookPagination />
                </div>
            </div>
        </BasicLayout>
    );
}
