import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "../../../bookstore/src/page/login";
import Home from "../../../bookstore/src/page/home";
import ProfilePage from "../../../bookstore/src/page/profile_showcase";
import ProfileEditorPage from "../../../bookstore/src/page/profile_editor";
import BookPage from "../../../bookstore/src/page/books";
import BookDetailPage from "../../../bookstore/src/page/book_info";
import CartPage from "../../../bookstore/src/page/cart";

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
                <Route path="/cart" element={<CartPage />} />
            </Routes>
        </BrowserRouter>
    );
}

