import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './reusable/AuthPage.css';
import Toast from './reusable/Toast';

const Register = () => {
  const [toast, setToast] = useState({ message: '', type: '' });
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userEmail: '',
    userFirstName: '',
    userLastName: '',
    userPassword: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8080/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setToast({ message: 'User registered successfully!', type: 'success' });
        setTimeout(() => {
          navigate('/login');
        }, 1000);
      } else {
        setToast({ message: 'Failed to register user.', type: 'error' });
      }
    } catch (error) {
      console.error("Error connecting to backend:", error);
      setToast({ message: 'Error occured during registration.', type: 'error' });
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-hero-section">
        <h1>Join Us</h1>
        <p>Create an account to start managing your portal services today.</p>
      </div>
      <div className="auth-form-section">
        <div className="auth-card">
          <h2>Create Account</h2>
          <form className="auth-form" onSubmit={handleRegister}>
            <div className="input-group">
              <label>Email Address</label>
              <input 
                name="userEmail"
                type="email" 
                className="auth-input"
                onChange={handleChange}
                required 
              />
            </div>
            <div className="input-group">
              <label>First Name</label>
              <input 
                name="userFirstName"
                type="name" 
                className="auth-input"
                onChange={handleChange}
                required 
              />
            </div><div className="input-group">
              <label>Last Name</label>
              <input 
                name="userLastName"
                type="name" 
                className="auth-input"
                onChange={handleChange}
                required 
              />
            </div>
            <div className="input-group">
              <label>Password</label>
              <input 
                name="userPassword"
                type="password" 
                className="auth-input"
                onChange={handleChange}
                required 
              />
            </div>
            <div className="input-group">
              <label>Confirm Password</label>
              <input 
                name="confirmPassword"
                type="password" 
                className="auth-input"
                onChange={handleChange}
                required 
              />
            </div>
            <button type="submit" className="auth-btn btn-primary">Create Account</button>
            <div className="auth-footer">
              Already have an account? <Link to="/login" className="auth-link">Login</Link>
            </div>
          </form>
          <Toast 
            message={toast.message} 
            type={toast.type} 
            onClose={() => setToast({ message: '', type: '' })} 
          />
        </div>
      </div>
    </div>
  );
};

export default Register;