import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

const isJwtExpired = (token) => {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
    return payload.exp ? payload.exp * 1000 <= Date.now() : true;
  } catch {
    return true;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (stored && token && !isJwtExpired(token)) {
      setUser(JSON.parse(stored));
    } else {
      localStorage.clear();
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res  = await authAPI.login({ email, password });
    const data = res.data.data;
    localStorage.setItem('token', data.token);
    localStorage.setItem('user',  JSON.stringify(data));
    setUser(data);
    return data;
  };

  const register = async (payload) => {
    const res = await authAPI.register(payload);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
