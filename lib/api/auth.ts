import { API_BASE_URL } from '@/lib/config';

export const getToken = (): string | null => {
  if(typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token');
};

export const setToken = (token: string): void => {
  localStorage.setItem('auth_token', token);
};

export const clearToken = (): void => {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user');
};

export interface User {
  id: string;
  email: string;
  name: string;
}

const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getToken() || ''}`,
});

export const authAPI = {
  register: async (data: { email: string; password: string; name: string }) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  login: async (data: { email: string; password: string }) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  me: async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
      headers: getHeaders(),
    });
    return res.json();
  },

  forgotPassword: async (email: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if(!res.ok) {
      throw new Error(data.error || data.message || 'Failed to send reset link');
    }
    return data;
  },

  resetPassword: async (data: { token: string; password: string }) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const response = await res.json();
    if(!res.ok) {
      throw new Error(response.error || response.message || 'Password reset failed');
    }
    return response;
  },
  googleLogin: async (credential: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential }),
    });
    return res.json();
},
};
