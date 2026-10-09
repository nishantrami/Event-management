import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [customer, setCustomer] = useState(null);
  const [customerToken, setCustomerToken] = useState(localStorage.getItem('eventora_customer_token'));
  const [admin, setAdmin] = useState(null);
  const [adminToken, setAdminToken] = useState(localStorage.getItem('eventora_admin_token'));
  const [loading, setLoading] = useState(true);

  // Initialize and verify customer on start
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (customerToken) {
          const res = await api.getCustomerProfile();
          if (res.success) {
            setCustomer(res.user);
          } else {
            customerLogout();
          }
        }
      } catch (err) {
        console.warn('Customer session expired or invalid:', err.message);
        customerLogout();
      }

      if (adminToken) {
        try {
          const storedAdmin = localStorage.getItem('eventora_admin_user');
          if (storedAdmin) {
            setAdmin(JSON.parse(storedAdmin));
          } else {
            setAdmin({ email: 'admin@eventpro.com', role: 'admin' });
          }
        } catch (e) {
          adminLogout();
        }
      }

      setLoading(false);
    };

    initAuth();
  }, []);

  // Customer login
  const customerLogin = async (email, password) => {
    const res = await api.customerLogin({ email, password });
    if (res.success && res.token) {
      localStorage.setItem('eventora_customer_token', res.token);
      localStorage.setItem('eventora_customer_user', JSON.stringify(res.user));
      setCustomerToken(res.token);
      setCustomer(res.user);
    }
    return res;
  };

  // Customer registration
  const customerRegister = async (formData) => {
    const res = await api.customerRegister(formData);
    if (res.success && res.token) {
      localStorage.setItem('eventora_customer_token', res.token);
      localStorage.setItem('eventora_customer_user', JSON.stringify(res.user));
      setCustomerToken(res.token);
      setCustomer(res.user);
    }
    return res;
  };

  // Customer logout
  const customerLogout = () => {
    localStorage.removeItem('eventora_customer_token');
    localStorage.removeItem('eventora_customer_user');
    setCustomerToken(null);
    setCustomer(null);
  };

  // Customer profile update
  const updateCustomerProfile = async (profileData) => {
    const res = await api.updateCustomerProfile(profileData);
    if (res.success) {
      setCustomer(prev => ({ ...prev, ...res.user }));
      localStorage.setItem('eventora_customer_user', JSON.stringify({ ...customer, ...res.user }));
    }
    return res;
  };

  // Admin Login
  const adminLogin = async (email, password) => {
    const res = await api.adminLogin({ email, password });
    if (res.success && res.token) {
      localStorage.setItem('eventora_admin_token', res.token);
      localStorage.setItem('eventora_admin_user', JSON.stringify(res.admin));
      setAdminToken(res.token);
      setAdmin(res.admin);
    }
    return res;
  };

  // Admin Logout
  const adminLogout = () => {
    localStorage.removeItem('eventora_admin_token');
    localStorage.removeItem('eventora_admin_user');
    setAdminToken(null);
    setAdmin(null);
  };

  return (
    <AuthContext.Provider
      value={{
        customer,
        customerToken,
        isCustomerLoggedIn: !!customerToken && !!customer,
        customerLogin,
        customerRegister,
        customerLogout,
        updateCustomerProfile,

        admin,
        adminToken,
        isAdminLoggedIn: !!adminToken,
        adminLogin,
        adminLogout,

        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
