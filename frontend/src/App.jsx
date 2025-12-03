import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './router/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Profile from './pages/Profile'; // Import the new page

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageBooks from './pages/admin/ManageBooks';
import TransactionApproval from './pages/transactions/TransactionApproval';
import { ToastProvider } from './context/ToastContext';
import { ConfirmationProvider } from './context/ConfirmationContext';

// Styles
import './styles/global.scss';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <ToastProvider>
          <ConfirmationProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            
            
            {/* SHARED ROUTE */}
            <Route path="/profile" element={
              // Any logged in user can access profile
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />

            {/* STUDENT ROUTES */}
            <Route path="/student/dashboard" element={
              <ProtectedRoute role="ROLE_STUDENT">
                <StudentDashboard />
              </ProtectedRoute>
            } />
            
            {/* ADMIN ROUTES */}
            <Route path="/admin/dashboard" element={
              <ProtectedRoute role="ROLE_ADMIN">
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/books" element={
              <ProtectedRoute role="ROLE_ADMIN">
                <ManageBooks />
              </ProtectedRoute>
            } />
            <Route path="/admin/transactions" element={
              <ProtectedRoute role="ROLE_ADMIN">
                <TransactionApproval />
              </ProtectedRoute>
            } />

            <Route path="/" element={<Navigate to="/login" />} />
          </Routes>
        </BrowserRouter>
          </ConfirmationProvider>
        </ToastProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;