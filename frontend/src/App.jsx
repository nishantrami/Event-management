import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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

// Admin Pages
import AdminLoginPage from './components/admin/AdminLoginPage';
import AdminDashboardPage from './components/admin/AdminDashboardPage';
import AdminBookingsPage from './components/admin/AdminBookingsPage';
import AdminSlotsPage from './components/admin/AdminSlotsPage';
import AdminServicesPage from './components/admin/AdminServicesPage';
import AdminCustomersPage from './components/admin/AdminCustomersPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <BookingProvider>
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
