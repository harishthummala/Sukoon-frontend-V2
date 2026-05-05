import { API_BASE_URL } from '@/lib/config';

const apiUrl = (path: string) => `${API_BASE_URL}${path}`;

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

const readJson = async (res: Response): Promise<any> => {
  const text = await res.text();
  let data: Record<string, any> = {};

  if (text) {
    try {
      const parsed = JSON.parse(text);
      data = parsed && typeof parsed === 'object' ? parsed : { message: String(parsed) };
    } catch {
      data = { message: text };
    }
  }

  if (!res.ok) {
    return {
      ...data,
      error: data.error || data.message || `Request failed (${res.status})`,
    };
  }

  return data;
};

export const authAPI = {
  register: async (data: { email: string; password: string; name: string }) => {
    const res = await fetch(apiUrl('/auth/register'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return readJson(res);
  },

  login: async (data: { email: string; password: string }) => {
    const res = await fetch(apiUrl('/auth/login'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return readJson(res);
  },

  me: async () => {
    const res = await fetch(apiUrl('/auth/me'), {
      headers: getHeaders(),
    });
    return readJson(res);
  },

  forgotPassword: async (email: string) => {
    const res = await fetch(apiUrl('/auth/forgot-password'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const data = await readJson(res);
    if(data.error) {
      throw new Error(data.error || 'Failed to send reset link');
    }
    return data;
  },

  resetPassword: async (data: { token: string; password: string }) => {
    const res = await fetch(apiUrl('/auth/reset-password'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const response = await readJson(res);
    if(response.error) {
      throw new Error(response.error || 'Password reset failed');
    }
    return response;
  },
  googleAuth: async (data: { credential: string; mode: 'login' | 'register' }) => {
    const res = await fetch(apiUrl('/auth/google'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    return readJson(res);
},
};
