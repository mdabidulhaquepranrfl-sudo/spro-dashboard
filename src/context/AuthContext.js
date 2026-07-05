'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { clearAuth, getAuth, isLoggedIn, saveAuth } from '@/lib/authStorage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setAuth(getAuth());
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (!isReady) return;
    if (
      pathname.startsWith('/login') ||
      pathname.startsWith('/register') ||
      pathname.startsWith('/reportList')
    )
      return;
    if (!isLoggedIn()) {
      router.replace('/login');
    }
  }, [isReady, pathname, router]);

  const login = useCallback((authPayload) => {
    const saved = saveAuth(authPayload);
    setAuth(saved);
    return saved;
  }, []);

  const logout = useCallback(() => {
    clearAuth();
    setAuth(null);
    router.replace('/login');
  }, [router]);

  const value = useMemo(
    () => ({
      auth,
      isReady,
      isLoggedIn: Boolean(auth?.user),
      login,
      logout,
    }),
    [auth, isReady, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
