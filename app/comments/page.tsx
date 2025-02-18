'use client';
import React, { useEffect, useState } from 'react';
import Table from '../_components/Table';
import { useNotifications, Notification } from '../_context/NotificationContext';

const Comments = () => {
    const { notifications } = useNotifications();

    const [filtered, setFiltered] = useState<Notification[] | null>(null);

    useEffect(() => {
        const commentNotifications = notifications.filter(item => item.type === 'Comment Tag');

        setFiltered(commentNotifications);
    }, [notifications])

    return (
        <Table type='Comments' notifications={filtered} />
    )
}

export default Comments;