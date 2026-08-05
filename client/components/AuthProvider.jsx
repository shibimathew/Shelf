'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { authAPI } from '@/lib/api';
import { useToast } from '@/components/ToastProvider';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const toast = useToast();

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (!loading && !user) {
      const publicPaths = ['/login', '/register'];
      if (!publicPaths.includes(pathname)) {
        router.push('/login');
      }
    }
    if (!loading && user) {
      if (pathname === '/login' || pathname === '/register') {
        router.push('/dashboard');
      }
    }
  }, [user, loading, pathname, router]);

  const checkAuth = async () => {
    try {
      const res = await authAPI.getProfile();
      setUser(res.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = (userData) => {
    setUser(userData);
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch {}
    setUser(null);
    toast.info('You have been signed out.', 'Signed Out');
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
