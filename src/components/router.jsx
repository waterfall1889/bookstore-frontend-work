import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "../views/login";
import Home from "../views/home";
import ProfilePage from "../views/profile_showcase";
import ProfileEditorPage from "../views/profile_editor";
import BookPage from "../views/books";
import BookDetailPage from "../views/book_info";
import CartPage from "../views/cart";
import ChartPage from "../views/charts";
import OrderPage from "../views/orders";
import SignPage from "../views/sign";
import ManagerHomePage from "../views/manager/managerBasic";
import ManagerUserPage from "../views/manager/userManage";
import ManagerOrderPage from "../views/manager/orderManage";
import ManagerChartPage from "../views/manager/chartsManage";
import ManagerBookPage from "../views/manager/bookManage";
import AddBookPage from "../views/manager/addBook";
import BooksEdit from "../views/manager/booksEdit";
import AuthorLookupPage from "../views/author_lookup";

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/home" element={<Home />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/profileEdit" element={<ProfileEditorPage />} />
                <Route path="/books" element={<BookPage />} />
                <Route path="/books/:id" element={<BookDetailPage />} />
                {/*:id 是一个动态参数，比如 /books/123 会传入 id = "123"*/}
                <Route path="/cart" element={<CartPage />} />
                <Route path="/orders" element={<OrderPage />} />
                <Route path="/sign" element={<SignPage />} />
                <Route path="/chart" element={<ChartPage />} />
                <Route path="/author-lookup" element={<AuthorLookupPage />} />

                <Route path="/manager/home" element={<ManagerHomePage />} />
                <Route path="/manager/users" element={<ManagerUserPage />} />
                <Route path="/manager/orders" element={<ManagerOrderPage />} />
                <Route path="/manager/charts" element={<ManagerChartPage />} />
                <Route path="/manager/books" element={<ManagerBookPage />} />
                <Route path="/manager/add" element={<AddBookPage />} />
                <Route path="/booksEdit/:id" element={<BooksEdit />} />
            </Routes>
        </BrowserRouter>
    );
}

