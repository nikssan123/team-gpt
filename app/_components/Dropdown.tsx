'use client';

import { DropdownMenu, Button, Avatar } from '@radix-ui/themes';
import React, { useState } from 'react';
import { BellIcon, PlusIcon } from '@radix-ui/react-icons';
import { useNotifications } from '../_context/NotificationContext';
import { useRouter } from "next/navigation";
import '../globals.css';
import Modal from './Modal';
import Alert from './Alert';

const Dropdown = () => {
    const router = useRouter();

    const { notifications, unread, markNotificationAsRead } = useNotifications();

    const [modalOpen, setModalOpen] = useState(false);
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMsg, setAlertMsg] = useState('');

    const setColor = (type: string) => {
        switch (type) {
            case 'Platform Update':
                return 'bg-blue-500';
            case 'Comment Tag':
                return 'bg-teal-500';
            case 'Access Granted':
                return 'bg-green-500';
            case 'Join Workspace':
                return 'bg-purple-500';
            default:
                return 'bg-blue-500'
        }
    }

    const formatMsg = (type: string, person?: string | null) => {
        switch (type) {
            case 'Platform Update':
                return 'New features - see what’s new';
            case 'Comment Tag':
                return `${person} tagged you in a comment`;
            case 'Access Granted':
                return `${person} shared a chat with you `;
            case 'Join Workspace':
                return `${person} joined your workspace`;
            default:
                return '';
        }
    }

    const getAvatar = (type: string) => {
        if (type === 'Platform Update') {
            return <Avatar
                fallback='S'
                size='1'
                className='bg-white'
            />
        } else {
            return (
                <Avatar
                    src='https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?&w=256&h=256&q=70&crop=focalpoint&fp-x=0.5&fp-y=0.3&fp-z=1&fit=crop'
                    fallback='A'
                    size='1'
                />
            );
        }
    };

    const onClick = async (id: string | undefined, type: string, release?: string | null) => {
        if (id) {
            await markNotificationAsRead(id);

            switch (type) {
                case 'Platform Update':
                    setAlertOpen(true);
                    setAlertMsg(release as string);
                    break;
                case 'Comment Tag':
                    return router.push('/comments');
                case 'Access Granted':
                    return router.push('/chats');
                case 'Join Workspace':
                    return router.push('/workspace');
                default:
                    return '';
            }
        }
    }

    return (
        <>
            <DropdownMenu.Root>
                <DropdownMenu.Trigger>
                    <Button className='relative' variant='ghost'>
                        <BellIcon className='w-16 h-16 text-white' />
                        {unread > 0 && (
                            <span className='top-0 left-10 bg-red-500 text-white text-xs rounded-full px-2'>
                                {unread}
                            </span>
                        )}
                    </Button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content
                    side='bottom'
                    align='center'
                    className='bg-slate-700'
                >
                    <DropdownMenu.Item className='hover:bg-white flex justify-center'>
                        <Button onClick={() => setModalOpen(true)} className='hover:bg-green-800' color='green'>Add New Notification <PlusIcon /></Button>
                    </DropdownMenu.Item>
                    <DropdownMenu.Separator />
                    {notifications.length > 0 ? notifications.map((item) => {
                        return (
                            <DropdownMenu.Item onClick={() => onClick(item.id, item.type, item.release)} className={`flex items-center ${setColor(item.type)} text-white`} key={item.id}>
                                <div className='flex items-center gap-2 overflow-hidden' >
                                    {getAvatar(item.type)}
                                    <span className='truncate'>
                                        {formatMsg(item.type, item.person)}
                                    </span>
                                </div>

                            </DropdownMenu.Item>
                        )
                    }) : <DropdownMenu.Item className='flex justify-center'>No Notifications</DropdownMenu.Item>}
                </DropdownMenu.Content>
            </DropdownMenu.Root>
            <Modal open={modalOpen} setOpen={setModalOpen} />
            <Alert open={alertOpen} setOpen={setAlertOpen} msg={alertMsg} />
        </>
    )
}

export default Dropdown;