import { createContext, useContext, useState } from 'react';
import { authApi } from '../api/auth.api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    if (email !== 'nirmalsenavirathna80@gmail.com' || password !== 'Nirmal@2002') {
      setLoading(false);
      return { ok: false, message: 'Invalid email or password' };
    }
    const fakeUser = { fullName: 'Nirmal S.', email, role: 'HR Manager' };
    const fakeToken = 'mock-token-' + Date.now();
    localStorage.setItem('token', fakeToken);
    localStorage.setItem('user', JSON.stringify(fakeUser));
    setToken(fakeToken);
    setUser(fakeUser);
    setLoading(false);
    return { ok: true };
  };

  const register = async (payload) => {
    setLoading(true);
    try { await authApi.register(payload); } catch {}
    setLoading(false);
    return { ok: true };
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const value = { user, token, loading, login, register, logout, isAuthenticated: !!token };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
