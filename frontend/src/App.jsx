import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthProvider from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import LoanPage from './pages/LoanPage';
import LogoutPage from './pages/LogoutPage';

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path='/login' element={<LoginPage />} />
          <Route path='/register' element={<RegisterPage />} />
          <Route path='/' element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path='/dashboard' element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path='/profile' element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path='/loans' element={<ProtectedRoute><LoanPage /></ProtectedRoute>} />
          <Route path="/logout" element={<LogoutPage />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}