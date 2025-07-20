// Real authentication functions
export interface User {
  id: string;
  email: string;
  name: string;
  username?: string;
  dob?: string;
}

export interface AuthResponse {
  message: string;
  result: {
    token: string;
    user: User;
  };
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:7000/api';

export const login = async (email: string, password: string): Promise<{ user: User; token: string }> => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error('Invalid credentials');
  }

  const data: AuthResponse = await response.json();
  
  // Store the token
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', data.result.token);
  }
  
  return {
    user: data.result.user,
    token: data.result.token
  };
};

export const signup = async (
  name: string, 
  username: string, 
  email: string, 
  password: string, 
  dob: string
): Promise<{ user: User; token: string }> => {
  const response = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, username, email, password, dob }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to create account');
  }

  const data: AuthResponse = await response.json();
  
  // Store the token
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', data.result.token);
  }
  
  return {
    user: data.result.user,
    token: data.result.token
  };
};

export const getStoredUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

export const getStoredToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  
  return localStorage.getItem('token');
};

export const storeUser = (user: User) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('user', JSON.stringify(user));
};

export const clearUser = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('user');
  localStorage.removeItem('token');
};

// Keep the old function names for backward compatibility
export const mockLogin = login;
export const mockSignup = signup;