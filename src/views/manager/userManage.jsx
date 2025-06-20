import React from 'react';
import ManagerLayout from "../../components/manager_layout";
import UserManagement from "../../components/manage/users";

export default function ManagerUserPage() {
    return (
        <ManagerLayout>
            <UserManagement>
            </UserManagement>
        </ManagerLayout>
    );
}