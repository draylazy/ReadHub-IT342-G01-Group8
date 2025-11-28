import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';
import '../styles/LoginPage.css';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('student'); // 'student' or 'admin'
  const [authMode, setAuthMode] = useState('login');     // 'login' or 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      alert(err.message || 'Login failed');
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        {/* Logo and Titles */}
        <Logo />
        <h1 className="uni-name">Cebu Institute of Technology University</h1>
        <h2 className="system-name">ReadHub Book Management System</h2>
        <p className="slogan">
          {activeTab === 'student'
            ? 'Share resources, build community'
            : 'Manage book management system operations'}
        </p>

        {/* Role Tabs */}
        <div className="role-tabs">
          <div
            className={`tab ${activeTab === 'student' ? 'active' : ''}`}
            onClick={() => setActiveTab('student')}
          >
            Student Login
          </div>
          <div
            className={`tab ${activeTab === 'admin' ? 'active' : ''}`}
            onClick={() => setActiveTab('admin')}
          >
            Admin Login
          </div>
        </div>

        {/* Student Login/Register Toggle */}
        {activeTab === 'student' && (
          <div className="auth-switch">
            <button
              className={`switch-btn ${authMode === 'login' ? 'active' : ''}`}
              onClick={() => setAuthMode('login')}
            >
              Login
            </button>
            <button
              className={`switch-btn ${authMode === 'register' ? 'active' : ''}`}
              onClick={() => setAuthMode('register')}
            >
              Register
            </button>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {activeTab === 'student' && authMode === 'register' && (
            <>
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" placeholder="Full Name" className="form-input" />
              </div>
              <div className="form-group">
                <label>Student ID</label>
                <input type="text" placeholder="Student ID" className="form-input" />
              </div>
            </>
          )}

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter Email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="submit-btn">
            {activeTab === 'student'
              ? authMode === 'login'
                ? 'Login'
                : 'Register'
              : 'Login as Admin'}
          </button>
        </form>
      </div>
    </div>
  );
}
