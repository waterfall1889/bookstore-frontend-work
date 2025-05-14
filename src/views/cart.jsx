import React from "react";
import CartList from "../components/cart_list";
import BasicLayout from "../components/layout";

export default function CartPage() {
    return (
        <BasicLayout>
            <CartList />
        </BasicLayout>
    );
}