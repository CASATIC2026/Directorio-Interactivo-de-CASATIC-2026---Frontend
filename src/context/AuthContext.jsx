import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('casatic_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('casatic_token', data.token);
      localStorage.setItem('casatic_user', JSON.stringify(data));
      setUser(data);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('casatic_token');
    localStorage.removeItem('casatic_user');
    setUser(null);
  };

  const cambiarPassword = async (nuevaPassword) => {
    const { data } = await api.post('/auth/cambiar-password', { nuevaPassword });
    // Actualizar token y flag
    localStorage.setItem('casatic_token', data.token);
    const updatedUser = { ...user, primerLogin: false, token: data.token };
    localStorage.setItem('casatic_user', JSON.stringify(updatedUser));
    setUser(updatedUser);
    return data;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, cambiarPassword, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
