import { AlertDialog, Text } from '@radix-ui/themes';
import React from 'react';

interface AlertProps {
    open: boolean;
    setOpen: (arg: boolean) => void;
    msg: string;
}

const Alert: React.FC<AlertProps> = ({ open, setOpen, msg }) => {
    return (
        <AlertDialog.Root open={open} onOpenChange={setOpen}>
            <AlertDialog.Content size='1' maxWidth='300px'>
                <AlertDialog.Title>New Release Notes</AlertDialog.Title>
                <Text as='p' trim='both' size='1'>
                    {msg}
                </Text>
            </AlertDialog.Content>
        </AlertDialog.Root>
    );
};

export default Alert;