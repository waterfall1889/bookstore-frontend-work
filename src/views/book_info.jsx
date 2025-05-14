import React from 'react';
import { useParams } from 'react-router-dom';
import BasicLayout from '../components/layout';
import BookDetails from '../components/book_details';
import {Divider} from "antd";
import BookCommentBox from "../components/book_comment_box";

const BookDetailPage = () => {
    const { id } = useParams();

    return (
        <BasicLayout>
            <BookDetails bookId={id} />
            <Divider />
            <BookCommentBox />
        </BasicLayout>
    );
};

export default BookDetailPage;
