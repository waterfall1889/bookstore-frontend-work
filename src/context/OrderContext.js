import React, { createContext, useContext, useReducer } from 'react';

const OrderContext = createContext();

const orderReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ORDER':
      const newOrder = {
        id: Date.now(),
        items: action.payload.items,
        totalAmount: action.payload.totalAmount,
        orderTime: new Date().toISOString(),
        status: '待发货'
      };
      console.log('Adding new order:', newOrder); // 添加日志
      return {
        ...state,
        orders: [newOrder, ...state.orders]
      };
    default:
      return state;
  }
};

export const OrderProvider = ({ children }) => {
  const [state, dispatch] = useReducer(orderReducer, { orders: [] });

  const addOrder = (items, totalAmount) => {
    console.log('addOrder called with:', { items, totalAmount }); // 添加日志
    dispatch({
      type: 'ADD_ORDER',
      payload: {
        items,
        totalAmount
      }
    });
  };

  return (
    <OrderContext.Provider
      value={{
        orders: state.orders,
        addOrder
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};