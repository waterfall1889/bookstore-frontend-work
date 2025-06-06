import React from 'react';
import ManagerLayout from "../../components/manager_layout";
import UserManagement from "../../components/users";

export default function ManagerUserPage() {
    return (
        <ManagerLayout>
            <UserManagement>
            </UserManagement>
        </ManagerLayout>
    );
}