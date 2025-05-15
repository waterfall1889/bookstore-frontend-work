// context/OrderContext.js
import React, { createContext, useContext, useState } from 'react';
import { message } from 'antd';

const OrderContext = createContext();

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);

  const addOrder = (items, totalAmount) => {
    const newOrder = {
      id: Date.now(),
      orderTime: new Date().toISOString(),
      items: items.map(item => ({
        id: item.id,
        title: item.title,
        author: item.author,
        price: item.price,
        cover: item.cover,
        quantity: item.quantity
      })),
      totalAmount,
      status: '待支付'
    };
    setOrders(prevOrders => [...prevOrders, newOrder]);
  };

  // 订单状态更新逻辑
  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
    message.success(`订单状态更新成功：${newStatus}`);
  };

  // 开发环境初始化示例数据
  const initializeSampleData = () => {
    setOrders([{
      id: 250418320303,
      orderTime: "2025-04-18T14:22:00",
      status: "待支付",
      items: [
        {
          id: 1,
          title: "挪威的森林",
          quantity: 1,
          price: 40.00,
          cover: '/bookcovers/book1.jpg'
        },
        {
          id: 2,
          title: "没有英雄的叙事诗",
          quantity: 2,
          price: 68.00,
          cover: '/bookcovers/book2.jpg'
        }
      ]
    }]);
  };

  return (
    <OrderContext.Provider value={{
      orders,
      addOrder,
      updateOrderStatus,
      initializeSampleData
    }}>
      {children}
    </OrderContext.Provider>
  );
};