import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { setUnauthorizedHandler, tokenStorage } from '../api/client';
import { authApi } from '../api/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const queryClient = useQueryClient();
  const [token, setToken] = useState(() => tokenStorage.get());
  const [user, setUser] = useState(null);

  const logout = useCallback(() => {
    tokenStorage.clear();
    setToken(null);
    setUser(null);
    queryClient.clear();
  }, [queryClient]);

  useEffect(() => {
    setUnauthorizedHandler(logout);
  }, [logout]);

  useEffect(() => {
    if (!token || user) return;
    authApi.me().then(setUser).catch(() => {});
  }, [token, user]);

  const authenticate = useCallback(async (request, credentials) => {
    const data = await request(credentials);
    tokenStorage.set(data.token);
    queryClient.clear();
    setToken(data.token);
    setUser(data.user);
  }, [queryClient]);

  const value = useMemo(() => ({
    token,
    user,
    isAuthenticated: Boolean(token),
    login: credentials => authenticate(authApi.login, credentials),
    register: credentials => authenticate(authApi.register, credentials),
    logout,
  }), [token, user, authenticate, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}
