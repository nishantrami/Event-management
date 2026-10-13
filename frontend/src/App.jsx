import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { BookingProvider } from './context/BookingContext';

// Layouts
import MainLayout from './layouts/MainLayout';
import AdminLayout from './components/admin/AdminLayout';

// Customer Pages
import HomePage from './components/pages/HomePage';
import EventsPage from './components/pages/EventsPage';
import BookingFlowPage from './components/pages/BookingFlowPage';
import ServicesPage from './components/pages/ServicesPage';
import PackagesPage from './components/pages/PackagesPage';
import CartPage from './components/pages/CartPage';
import BookingSuccessPage from './components/pages/BookingSuccessPage';
import CustomerDashboardPage from './components/pages/CustomerDashboardPage';
import LoginPage from './components/pages/LoginPage';
import RegisterPage from './components/pages/RegisterPage';
import ContactPage from './components/pages/ContactPage';

// Admin Pages
import AdminLoginPage from './components/admin/AdminLoginPage';
import AdminDashboardPage from './components/admin/AdminDashboardPage';
import AdminBookingsPage from './components/admin/AdminBookingsPage';
import AdminSlotsPage from './components/admin/AdminSlotsPage';
import AdminServicesPage from './components/admin/AdminServicesPage';
import AdminCustomersPage from './components/admin/AdminCustomersPage';

// Secret Admin Shortcut Listener (Ctrl + E)
function SecretAdminListener() {
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Secret key combination: Ctrl + E or Cmd + E (case-insensitive)
      if ((e.ctrlKey || e.metaKey) && (e.key === 'e' || e.key === 'E' || e.code === 'KeyE')) {
        e.preventDefault(); // Prevents browser search omnibox focus
        setShowToast(true);
        setTimeout(() => {
          setShowToast(false);
          navigate('/admin/login');
        }, 300);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  if (!showToast) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 999999,
      background: '#090d16',
      border: '1.5px solid #7c3aed',
      color: '#ffffff',
      padding: '12px 24px',
      borderRadius: '999px',
      boxShadow: '0 12px 35px rgba(0, 0, 0, 0.45)',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      fontSize: '0.88rem',
      fontWeight: '700',
      pointerEvents: 'none'
    }}>
      <span style={{ fontSize: '1.1rem' }}>🔒</span>
      <span>Secret Key Detected (Ctrl + E) — Opening Admin Console...</span>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <BookingProvider>
          <SecretAdminListener />
          <Routes>
            {/* Customer Website Routes */}
            <Route path="/" element={<MainLayout />}>
              <Route index element={<HomePage />} />
              <Route path="events" element={<EventsPage />} />
              <Route path="book" element={<BookingFlowPage />} />
              <Route path="cart" element={<CartPage />} />
              <Route path="booking-summary" element={<CartPage />} />
              <Route path="services" element={<ServicesPage />} />
              <Route path="packages" element={<PackagesPage />} />
              <Route path="contact" element={<ContactPage />} />
              <Route path="booking-success/:id" element={<BookingSuccessPage />} />
              <Route path="my-bookings" element={<CustomerDashboardPage />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
            </Route>

            {/* Admin Static Login */}
            <Route path="/admin/login" element={<AdminLoginPage />} />

            {/* Admin Dashboard Protected Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboardPage />} />
              <Route path="bookings" element={<AdminBookingsPage />} />
              <Route path="slots" element={<AdminSlotsPage />} />
              <Route path="services" element={<AdminServicesPage />} />
              <Route path="customers" element={<AdminCustomersPage />} />
            </Route>

            {/* 404 Catch All */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BookingProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
