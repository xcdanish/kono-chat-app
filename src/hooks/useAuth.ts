import { useState, useCallback } from 'react';
import { User, AuthState } from '../types';

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null
  });

  const login = useCallback((email: string, password: string) => {
    const mockUser: User = {
      id: '1',
      name: 'Alex Johnson',
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
      status: 'online',
      email,
      phone: '+1 (555) 123-4567'
    };
    
    setAuthState({
      isAuthenticated: true,
      user: mockUser
    });
  }, []);

  const signup = useCallback((name: string, email: string, password: string) => {
    const mockUser: User = {
      id: '1',
      name,
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
      status: 'online',
      email,
      phone: '+1 (555) 123-4567'
    };
    
    setAuthState({
      isAuthenticated: true,
      user: mockUser
    });
  }, []);

  const logout = useCallback(() => {
    setAuthState({
      isAuthenticated: false,
      user: null
    });
  }, []);

  return {
    authState,
    login,
    signup,
    logout
  };
};