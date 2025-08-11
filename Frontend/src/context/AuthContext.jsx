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
    // Check authentication status on app load
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // First try to get current user data
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user/me`, {
        withCredentials: true // Important: This sends cookies
      });
      
      if (response.data?.user) {
        setIsAuthenticated(true);
        setUser(response.data.user);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(response.data.user));
      } else {
        // If no user data, check auth status
        const authResponse = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user/check-auth`, {
          withCredentials: true
        });
        
        if (authResponse.data?.isAuthenticated && authResponse.data?.user) {
          setIsAuthenticated(true);
          setUser(authResponse.data.user);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(authResponse.data.user));
        } else {
          // Not authenticated
          localStorage.removeItem(STORAGE_KEY);
          setIsAuthenticated(false);
          setUser(null);
        }
      }
    } catch (error) {
      console.log('Check auth failed, falling back to local state', error);
      
      // Fallback to localStorage if server is unavailable
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setUser(parsed);
          setIsAuthenticated(true);
        } catch (e) {
          console.error('Failed to parse user from localStorage', e);
          localStorage.removeItem(STORAGE_KEY);
          setIsAuthenticated(false);
          setUser(null);
        }
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/login`,
        { email, password },
        { withCredentials: true } // Important: This receives cookies
      );
      
      if (response.data.user) {
        setIsAuthenticated(true);
        setUser(response.data.user);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(response.data.user));
        return { success: true, user: response.data.user };
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
      localStorage.removeItem('userRole');
    }
  };

  const refreshUserData = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user/me`, {
        withCredentials: true
      });
      if (response.data?.user) {
        setUser(response.data.user);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(response.data.user));
        return response.data.user;
      }
    } catch (e) {
      console.error('Failed to refresh user data from server', e);
      // Fallback to localStorage
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setUser(parsed);
          return parsed;
        } catch (e) {
          console.error('Failed to parse user from localStorage', e);
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
