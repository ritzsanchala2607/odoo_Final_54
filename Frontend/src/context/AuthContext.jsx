import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const STORAGE_KEY = 'auth_user';

  useEffect(() => {
    // Hydrate from localStorage first so UI has data even if server endpoints are missing
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setUser(parsed);
        setIsAuthenticated(true);
      } catch (_) {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    // Best-effort server check; if endpoint doesn't exist, fallback to local state
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user/check-auth`, {
        withCredentials: true
      });
      if (response.data?.isAuthenticated && response.data?.user) {
        setIsAuthenticated(true);
        setUser(response.data.user);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(response.data.user));
      } else {
        // If server says not authenticated, clear local
        localStorage.removeItem(STORAGE_KEY);
        setIsAuthenticated(false);
        setUser(null);
      }
    }
    //  catch (error) {
    //   // Server route may not exist; do not clear local state in this case
    // }
     finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/login`,
        { email, password },
        { withCredentials: true }
      );
      
      if (response.data.user) {
        setIsAuthenticated(true);
        setUser(response.data.user);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(response.data.user));
        return { success: true };
      }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const logout = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/user/logout`, {}, {
        withCredentials: true
      });
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsAuthenticated(false);
      setUser(null);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const refreshUserData = async () => {
    // Try server, else fall back to localStorage
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user/me`, {
        withCredentials: true
      });
      if (response.data?.user) {
        setUser(response.data.user);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(response.data.user));
        return response.data.user;
      }
    } catch (_) {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setUser(parsed);
          return parsed;
        } catch (_) {
          localStorage.removeItem(STORAGE_KEY);
        }
      }
    }
  };

  const value = {
    isAuthenticated,
    user,
    loading,
    login,
    logout,
    checkAuthStatus,
    refreshUserData
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
