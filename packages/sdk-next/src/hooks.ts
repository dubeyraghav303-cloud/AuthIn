'use client';

import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export function useUser() {
    const { data, error, isLoading } = useSWR('/api/auth/profile', fetcher);

    return {
        user: data,
        isLoading,
        isError: error,
        isAuthenticated: !!data
    };
}

export function useTenant() {
    const { data, error, isLoading } = useSWR('/api/auth/tenant', fetcher);
    return {
        tenant: data,
        isLoading,
        isError: error
    };
}
