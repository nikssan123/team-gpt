'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNotifications } from '../_context/NotificationContext';

const notificationSchema = z.object({
    type: z.enum(['Platform Update', 'Comment Tag', 'Access Granted', 'Join Workspace']),
    message: z.string().min(5, 'Message must be at least 5 characters'),
    person: z.string().optional(),
    release: z.string().optional(),
}).superRefine((data, ctx) => {
    if (data.type !== 'Platform Update' && !data.person) {
        ctx.addIssue({
            path: ['person'],
            message: 'Please specify a person',
            code: z.ZodIssueCode.custom,
        });
    } else if (data.type === 'Platform Update' && !data.release) {
        ctx.addIssue({
            path: ['release'],
            message: 'Please specify a release',
            code: z.ZodIssueCode.custom,
        });
    }
});;

export type NotificationFormData = z.infer<typeof notificationSchema>;

interface NotificationFormProps {
    setOpen: (arg: boolean) => void;
}

const NotificationForm: React.FC<NotificationFormProps> = ({ setOpen }) => {
    const { addNotification } = useNotifications();

    const [selectedType, setSelectedType] = useState<NotificationFormData['type'] | ''>('Platform Update');
    const [error, setError] = useState<string | null>('');
    const [success, setSuccess] = useState<string | null>('');

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<NotificationFormData>({
        resolver: zodResolver(notificationSchema),
        defaultValues: { type: 'Platform Update', message: '', person: '', release: '' },
    });

    const onSubmit = async (data: NotificationFormData) => {

        try {
            await addNotification(data);
            setSuccess('Successfully created a new notification!');

            setTimeout(() => {
                setSuccess(null);
                setOpen(false);
            }, 3000);
        } catch (e) {
            setError('Something went wrong')
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='bg-white rounded-md w-full max-w-md' id='form'>
            <label className='block mb-2 font-semibold'>Notification Type</label>
            <Controller
                name='type'
                control={control}
                render={({ field }) => (
                    <select
                        {...field}
                        onChange={(e) => {
                            field.onChange(e);
                            setSelectedType(e.target.value as NotificationFormData['type']);
                        }}
                        className='w-full p-2 border rounded-md'
                    >
                        <option value='Platform Update'>Platform Update</option>
                        <option value='Comment Tag'>Comment Tag</option>
                        <option value='Access Granted'>Access Granted</option>
                        <option value='Join Workspace'>Join Workspace</option>
                    </select>
                )}
            />
            {errors.type && <p className='text-red-500 text-sm'>{errors.type.message}</p>}

            <label className='block mt-4 font-semibold'>Message</label>
            <input
                {...register('message')}
                className='w-full p-2 border rounded-md'
                placeholder='Enter message...'
            />
            {errors.message && <p className='text-red-500 text-sm'>{errors.message.message}</p>}

            {selectedType === 'Platform Update' ? (
                <>
                    <label className='block mt-4 font-semibold'>Release Number</label>
                    <input
                        {...register('release')}
                        className='w-full p-2 border rounded-md'
                        placeholder='Enter release version (e.g., 1.2.3)'
                    />
                    {errors.release && <p className='text-red-500 text-sm'>{errors.release.message}</p>}
                </>
            ) :
                <>
                    <label className='block mt-4 font-semibold'>Person Name</label>
                    <input
                        {...register('person')}
                        className='w-full p-2 border rounded-md'
                        placeholder="Enter person' s name'"
                    />
                    {errors.person && <p className='text-red-500 text-sm'>{errors.person.message}</p>}
                </>
            }
            {error && <p className='text-red-500 text-sm'>{error}</p>}
            {success && <p className='text-white text-sm bg-green-600 p-3 mt-1'>{success}</p>}
        </form>
    );
}

export default NotificationForm;