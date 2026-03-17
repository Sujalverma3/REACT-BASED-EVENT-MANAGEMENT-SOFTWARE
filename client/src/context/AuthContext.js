import React, { createContext, useContext, useState, useEffect } from 'react';
import { getMe } from '../api';

const Ctx = createContext();

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(() => { try { return JSON.parse(localStorage.getItem('user')); } catch { return null; } });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verify = async () => {
      if (localStorage.getItem('token')) {
        try { const { data } = await getMe(); setUser(data.user); localStorage.setItem('user', JSON.stringify(data.user)); }
        catch { logout(); }
      }
      setLoading(false);
    };
    verify();
  }, []);

  const loginUser = (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return <Ctx.Provider value={{ user, loading, loginUser, logout, setUser }}>{children}</Ctx.Provider>;
}

export const useAuth = () => useContext(Ctx);
