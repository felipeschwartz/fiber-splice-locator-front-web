import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { login as loginRequest } from '../api/authService';
import { tokenStorage } from '../api/client';

const AuthContext = createContext(null);

const USER_STORAGE_KEY = 'fiberSpliceLocator.user';
const ALLOWED_ROLES = ['ADMIN', 'GOD_ADMIN'];

function readStoredUser() {
  try {
    const raw = localStorage.getItem(USER_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => (tokenStorage.get() ? readStoredUser() : null));

  const login = useCallback(async (email, password) => {
    const data = await loginRequest(email, password);
    if (!data?.token) throw new Error('A resposta do servidor não contém um token.');

    const roles = data.user?.roles || [];
    if (!roles.some((role) => ALLOWED_ROLES.includes(role))) {
      throw new Error('Este painel é restrito a administradores (ADMIN ou GOD_ADMIN).');
    }

    tokenStorage.set(data.token);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.user));
    setUser(data.user);
  }, []);

  const logout = useCallback(() => {
    tokenStorage.clear();
    localStorage.removeItem(USER_STORAGE_KEY);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, isAuthenticated: Boolean(user), login, logout }),
    [user, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth deve ser usado dentro de AuthProvider.');
  return context;
}
