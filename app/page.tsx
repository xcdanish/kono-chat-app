'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { loadStoredAuthThunk } from '@/lib/slices/authSlice';

export default function Home() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      await dispatch(loadStoredAuthThunk());
      setHasCheckedAuth(true);
    };
    checkAuth();
  }, [dispatch]);

  useEffect(() => {
    if (hasCheckedAuth && !isLoading) {
      if (isAuthenticated) {
        router.push('/chat');
      } else {
        router.push('/login');
      }
    }
  }, [isAuthenticated, isLoading, hasCheckedAuth, router]);

  if (!hasCheckedAuth || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Optionally, show nothing or a spinner while deciding
  return null;
}