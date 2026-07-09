import React, { createContext, useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import axiosInstance from '../api/axiosInstance';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = () => {
    Cookies.remove('access_token');
    Cookies.remove('refresh_token');
    setUser(null);
  };

  useEffect(() => {
    const fetchUser = async () => {
      const token = Cookies.get('access_token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await axiosInstance.get('/auth/profile/');
        // Customer access: allow any authenticated user; backend may include role fields.
        setUser(res.data);
      } catch (error) {
        setUser(null);
        logout();
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (credentials) => {
    const res = await axiosInstance.post('/auth/login/', credentials);
    Cookies.set('access_token', res.data.access);
    Cookies.set('refresh_token', res.data.refresh);

    const profileRes = await axiosInstance.get('/auth/profile/');
    setUser(profileRes.data);
    return true;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
};
