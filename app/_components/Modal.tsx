'use client';

import { Dialog, Button, Flex } from '@radix-ui/themes';
import React from 'react';
import NotificationForm from './NotificationForm';

const Modal: React.FC<{ open: boolean; setOpen: (arg: boolean) => void }> = ({ open, setOpen }) => {
    return (
        <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Content maxWidth='450px'>
                <Dialog.Title>Add Notification</Dialog.Title>

                <Flex direction='column' gap='3'>
                    <NotificationForm setOpen={setOpen} />
                </Flex>

                <Flex gap='3' mt='4' justify='end'>
                    <Dialog.Close>
                        <Button variant='soft' color='gray'>
                            Cancel
                        </Button>
                    </Dialog.Close>
                    <Button type='submit' form='form'>Save</Button>
                </Flex>
            </Dialog.Content>
        </Dialog.Root>

    )
}

export default Modal;