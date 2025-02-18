'use client';

import React, { useEffect, useState } from "react";
import { useNotifications, Notification } from "../_context/NotificationContext";
import Table from "../_components/Table";

const Chats = () => {
    const { notifications } = useNotifications();

    const [filtered, setFiltered] = useState<Notification[] | null>(null);

    useEffect(() => {
        const chatsNotifications = notifications.filter(item => item.type === 'Access Granted');

        setFiltered(chatsNotifications);
    }, [notifications])

    return (
        <Table type='Chats' notifications={filtered} />
    )
}

export default Chats;