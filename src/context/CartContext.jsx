import React, { createContext, useContext, useState } from 'react';

export const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartList, setCartList] = useState([]);

    const addToCart = (book, quantity = 1) => {
        setCartList(prev => {
            const exists = prev.find(item => item.id === book.id);
            if (exists) {
                return prev.map(item =>
                    item.id === book.id ? { ...item, number: item.number + quantity } : item
                );
            } else {
                return [...prev, {
                    id: book.id,
                    bookname: book.bookname,
                    number: quantity,
                    singleCost: book.price,
                    bookCover: book.bookpicture
                }];
            }
        });
    };

    const updateQuantity = (id, value) => {
        setCartList(prev =>
            prev.map(item =>
                item.id === id ? { ...item, number: value } : item
            )
        );
    };

    const deleteItem = (id) => {
        setCartList(prev => prev.filter(item => item.id !== id));
    };

    return (
        <CartContext.Provider value={{ cartList, addToCart, updateQuantity, deleteItem }}>
            {children}
        </CartContext.Provider>
    );
};
