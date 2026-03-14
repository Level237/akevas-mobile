import { selectIsAuthenticated } from '@/features/auth/authSlice';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { useAppSelector } from './hooks';

export const useRequireAuth = () => {
    const router = useRouter();
    const isAuthenticated = useAppSelector(selectIsAuthenticated);

    useEffect(() => {
        if (!isAuthenticated) {
            router.replace('/login');
        }
    }, [isAuthenticated, router]);

    return isAuthenticated;
};