'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import React, { useState } from 'react';

import { trpc } from './client';

interface ProviderProps {
    children: React.ReactNode;
}

const Provider: React.FC<ProviderProps> = ({ children }) => {
    const url = process.env.IS_PROD ? (process.env.NEXT_PUBLIC_API_URL ? process.env.NEXT_PUBLIC_API_URL : '') : 'http://localhost:3000/api/trpc'

    const [queryClient] = useState(() => new QueryClient({}));
    const [trpcClient] = useState(() =>
        trpc.createClient({
            links: [
                httpBatchLink({
                    url
                })
            ]
        })
    );

    return (
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
            <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </trpc.Provider>
    )
}

export default Provider;