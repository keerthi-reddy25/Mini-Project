import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';

// Auth pages
import LoginPage    from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// Customer pages
import CustomerDashboard from './pages/customer/CustomerDashboard';
import ServicesPage      from './pages/customer/ServicesPage';
import BookingPage       from './pages/customer/BookingPage';
import AppointmentsPage  from './pages/customer/AppointmentsPage';
import ProfilePage       from './pages/customer/ProfilePage';

// Admin pages
import AdminDashboard   from './pages/admin/AdminDashboard';
import AdminServices    from './pages/admin/AdminServices';
import AdminAppointments from './pages/admin/AdminAppointments';
import AdminUsers       from './pages/admin/AdminUsers';

const ProtectedRoute = ({ requiredRole }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-screen"><div className="spinner"/></div>;
  if (!user) return <Navigate to="/login" replace />;
  if (requiredRole && user.role !== requiredRole) return <Navigate to="/" replace />;
  return <Outlet />;
};

const RootRedirect = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return user.role === 'ADMIN'
    ? <Navigate to="/admin/dashboard" replace />
    : <Navigate to="/customer/dashboard" replace />;
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Toaster position="top-right" toastOptions={{ duration: 3500 }} />
        <Routes>
          <Route path="/"         element={<RootRedirect />} />
          <Route path="/login"    element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Customer routes */}
          <Route path="/customer" element={<ProtectedRoute requiredRole="CUSTOMER" />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard"    element={<CustomerDashboard />} />
            <Route path="services"     element={<ServicesPage />} />
            <Route path="book/:id"     element={<BookingPage />} />
            <Route path="appointments" element={<AppointmentsPage />} />
            <Route path="profile"      element={<ProfilePage />} />
          </Route>

          {/* Admin routes */}
          <Route path="/admin" element={<ProtectedRoute requiredRole="ADMIN" />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard"    element={<AdminDashboard />} />
            <Route path="services"     element={<AdminServices />} />
            <Route path="appointments" element={<AdminAppointments />} />
            <Route path="users"        element={<AdminUsers />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
