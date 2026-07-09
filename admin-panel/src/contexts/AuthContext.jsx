import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import Cookies from 'js-cookie';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = Cookies.get('access_token');
      if (token) {
        try {
          const res = await axiosInstance.get('/auth/profile/');
          if (res.data.is_staff || res.data.is_superuser) {
            setUser(res.data);
          } else {
            // Not an admin
            setUser(null);
            logout();
          }
        } catch (error) {
          console.error("Failed to fetch user profile:", error);
          setUser(null);
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  const login = async (credentials) => {
    const res = await axiosInstance.post('/auth/login/', credentials);
    Cookies.set('access_token', res.data.access);
    Cookies.set('refresh_token', res.data.refresh);
    
    // Fetch profile to verify admin
    const profileRes = await axiosInstance.get('/auth/profile/');
    if (profileRes.data.is_staff || profileRes.data.is_superuser) {
        setUser(profileRes.data);
        return true;
    } else {
        logout();
        throw new Error('Access denied. Admin privileges required.');
    }
  };

  const logout = () => {
    Cookies.remove('access_token');
    Cookies.remove('refresh_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
