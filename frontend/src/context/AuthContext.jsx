import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  loginApi,
  registerApi,
  logoutApi,
  fetchCurrentUserApi,
  forgotPasswordApi,
  resetPasswordApi
} from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => {
    return localStorage.getItem('hydro_token') || sessionStorage.getItem('hydro_token') || null;
  });
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // Auto-hide toast notifications after 5 seconds
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Initial user fetch on app start if token exists
  useEffect(() => {
    async function loadUser() {
      if (token) {
        try {
          const userData = await fetchCurrentUserApi();
          if (userData) {
            setUser(userData);
          } else {
            logout();
          }
        } catch (e) {
          logout();
        }
      }
      setLoading(false);
    }
    loadUser();
  }, [token]);

  const login = async (email, password, rememberMe = false) => {
    try {
      const res = await loginApi({ email, password, rememberMe });
      if (res.token && res.user) {
        setToken(res.token);
        setUser(res.user);
        if (rememberMe) {
          localStorage.setItem('hydro_token', res.token);
        } else {
          sessionStorage.setItem('hydro_token', res.token);
        }
        setToast({ type: 'success', text: res.message || 'Welcome back! Login successful.' });
        return { success: true, user: res.user };
      }
      throw new Error(res.message || 'Authentication failed');
    } catch (err) {
      setToast({ type: 'error', text: err.message || 'Unable to sign in. Please check your credentials.' });
      throw err;
    }
  };

  const register = async (formData) => {
    try {
      const res = await registerApi(formData);
      setToast({ type: 'success', text: res.message || 'Account created successfully. Please sign in.' });
      return res;
    } catch (err) {
      setToast({ type: 'error', text: err.message || 'Registration failed.' });
      throw err;
    }
  };

  const logout = async () => {
    await logoutApi();
    localStorage.removeItem('hydro_token');
    sessionStorage.removeItem('hydro_token');
    setToken(null);
    setUser(null);
    setToast({ type: 'info', text: 'You have been logged out successfully.' });
  };

  const forgotPassword = async (email) => {
    try {
      const res = await forgotPasswordApi(email);
      setToast({ type: 'info', text: res.message });
      return res;
    } catch (err) {
      setToast({ type: 'error', text: err.message || 'Failed to process request.' });
      throw err;
    }
  };

  const resetPassword = async (payload) => {
    try {
      const res = await resetPasswordApi(payload);
      setToast({ type: 'success', text: res.message || 'Password reset successfully.' });
      return res;
    } catch (err) {
      setToast({ type: 'error', text: err.message || 'Password reset failed.' });
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        toast,
        setToast,
        login,
        register,
        logout,
        forgotPassword,
        resetPassword
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
