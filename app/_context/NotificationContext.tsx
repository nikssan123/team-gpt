'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { trpc } from '@/app/_trpc/client';
import { Spinner } from '@radix-ui/themes';

export interface Notification {
    id?: string;
    type: string;
    message: string;
    read?: boolean;
    person: string | null;
    release: string | null;
    createdAt: string;
}

interface NotificationInput {
    type: string;
    message: string;
    person?: string | null;
    release?: string | null;
}

interface NotificationContextType {
    notifications: Notification[];
    markAsRead: (id: string) => void;
    addNotification: (notification: NotificationInput) => void;
    markNotificationAsRead: (id: string) => void;
    unread: number;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
    children: React.ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
    const { data, isLoading, error } = trpc.getNotifications.useQuery();

    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unread, setUnread] = useState(0);

    useEffect(
        () => {
            if (data) {
                setNotifications(data);

                const unreadCount = data.filter((notification: Notification) => !notification.read).length;
                setUnread(unreadCount);
            }
        },
        [data]
    );

    const { mutateAsync: createNotification } = trpc.createNotification.useMutation({
        onSuccess: newNotification => {
            setNotifications(prev => [newNotification, ...prev]);
            setUnread(prevUnread => prevUnread + 1);
        },
        onError: error => {
            console.error('Error creating notification:', error);
        },
    });

    const addNotification = async (notification: NotificationInput) => {
        try {
            const sanitizedNotification = {
                ...notification,
                person: notification.person === null ? '' : notification.person,
                release: notification.release === null ? '' : notification.release,
            };
            await createNotification(sanitizedNotification);
        } catch (error) {
            console.error('Error adding notification:', error);
        }
    };

    const { mutate: markAsRead } = trpc.markAsRead.useMutation({
        onSuccess: updatedNotification => {
            setNotifications(prev =>
                prev.map(
                    notif => (notif.id === updatedNotification.id ? updatedNotification : notif)
                )
            );

            setUnread(prevUnread => (updatedNotification.read ? prevUnread - 1 : prevUnread));
        },
        onError: err => {
            console.error('Error marking notification as read:', err);
        },
    });

    const markNotificationAsRead = (id: string) => {
        markAsRead(id);
    };

    if (error) {
        return <div>Error loading notifications</div>;
    }

    return (
        <Spinner size='3' loading={isLoading}>
            <NotificationContext.Provider
                value={{
                    notifications,
                    markAsRead,
                    addNotification,
                    markNotificationAsRead,
                    unread,
                }}
            >
                {children}
            </NotificationContext.Provider>
        </Spinner>
    );
};

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
};
