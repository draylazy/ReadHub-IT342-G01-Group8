/* RegisterPage.jsx */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';
import '../styles/RegisterPage.css';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    try {
      await register(formData);
      alert('Registration successful');
      navigate('/login');
    } catch (err) {
      alert(err.message || 'Registration failed');
    }
  };

  return (
    <div className="register-page">
      <div className="left-side">
        <Logo />
        <h1 className="title">Welcome</h1>
        <form onSubmit={handleSubmit}>
          <input name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} required />
          <input name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} required />
          <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
          <input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
          <input name="confirmPassword" type="password" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} required />
          <button type="submit">Sign Up</button>
        </form>
        <div className="signin-link" onClick={() => navigate('/login')}>
          Already have an account? Sign In
        </div>
      </div>
      <div className="right-side"></div>
    </div>
  );
}