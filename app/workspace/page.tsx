'use client';
import React, { useEffect, useState } from 'react';
import Table from '../_components/Table';
import { useNotifications, Notification } from '../_context/NotificationContext';


const Workspace = () => {
    const { notifications } = useNotifications();

    const [filtered, setFiltered] = useState<Notification[] | null>(null);

    useEffect(() => {
        const workspaceNotifications = notifications.filter(item => item.type === 'Join Workspace');

        setFiltered(workspaceNotifications);
    }, [notifications])

    return (
        <Table type='Workspace' notifications={filtered} />
    )
}

export default Workspace;