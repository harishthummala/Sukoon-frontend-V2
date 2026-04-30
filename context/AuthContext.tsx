'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, getToken, setToken, clearToken } from '@/lib/api/auth';
import type { User } from '@/lib/api/auth';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  googleLogin: (credential: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setTokenState] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in
  useEffect(() => {
    const storedToken = getToken();
    if (storedToken) {
      setTokenState(storedToken);
      authAPI
        .me()  // ← changed from getCurrentUser(storedToken)
        .then(setUser)
        .catch(() => {
          clearToken();
          setTokenState(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const googleLogin = async (credential: string) => {
    const response = await authAPI.googleLogin(credential);
    if(response.error) {
        throw new Error(response.error);
    }
    setToken(response.token);
    setTokenState(response.token);
    setUser(response.user);
  };
  const login = async (email: string, password: string) => {
    const response = await authAPI.login({ email, password }); 
    if(response.error) {
      throw new Error(response.error);
    }
    setToken(response.token);
    setTokenState(response.token);
    setUser(response.user);
  };

  const register = async (email: string, password: string, name: string) => {
    const response = await authAPI.register({ email, password, name }); 
    if(response.error) {
      throw new Error(response.error);
    }
    setToken(response.token);
    setTokenState(response.token);
    setUser(response.user);
  };

  const logout = () => {
    clearToken();
    setTokenState(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        googleLogin,
        login,
        register,
        logout,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
