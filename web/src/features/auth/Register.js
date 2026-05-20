import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './AuthPage.css';
import Toast from '../../shared/components/Toast';
import { API_BASE_URL } from '../../shared/utils/config';
import BayanLinkLogo from './Logo.png';

const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);

const EyeOffIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
    <line x1="1" y1="1" x2="23" y2="23"></line>
  </svg>
);

const Register = () => {
  const [toast, setToast] = useState({ message: '', type: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

    if (!formData.userEmail.endsWith("@gmail.com")) {
      return setToast({ message: 'Only @gmail.com addresses are allowed.', type: 'error' });
    }
    
    // eslint-disable-next-line no-useless-escape
    const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).+$/;
    if (!passwordRegex.test(formData.userPassword)) {
      return setToast({ message: 'Password needs at least 1 number and 1 special character.', type: 'error' });
    }

    if (formData.userPassword !== formData.confirmPassword) {
      return setToast({ message: 'Passwords do not match.', type: 'error' });
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/users/register`, {
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
        <img 
          src={BayanLinkLogo} 
          alt="BayanLink Logo" 
          className="auth-logo" 
        />
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
                value={formData.userEmail}
                className="auth-input"
                onChange={handleChange}
                placeholder="name@company.com"
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
                placeholder="Juan"
                required 
              />
            </div><div className="input-group">
              <label>Last Name</label>
              <input 
                name="userLastName"
                type="name" 
                className="auth-input"
                onChange={handleChange}
                placeholder="Dela Cruz"
                required 
              />
            </div>
            <div className="input-group">
              <label>Password</label>
              <div className="password-input-wrapper">
                <input 
                  name="userPassword"
                  type={showPassword ? "text" : "password"} 
                  className="auth-input"
                  value={formData.userPassword}
                  onChange={handleChange}
                  placeholder="*********"
                  required 
                />
                <button 
                  type="button" 
                  className="password-toggle" 
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>
            <div className="input-group">
              <label>Confirm Password</label>
              <div className="password-input-wrapper">
                <input 
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"} 
                  className="auth-input"
                  value={formData.confirmPassword} // Keep it controlled
                  onChange={handleChange}
                  placeholder="*********"
                  required 
                />
                <button 
                  type="button" 
                  className="password-toggle" 
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
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