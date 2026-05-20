import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../shared/context/AuthContext'; 
import './AuthPage.css';
import Toast from '../../shared/components/Toast';
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

const Login = () => {  
  const [toast, setToast] = useState({ message: '', type: '' });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth(); 
  const [userEmail, setEmail] = useState('');
  const [userPassword, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!userEmail.endsWith("@gmail.com")) {
      return setToast({ message: 'Only @gmail.com addresses are allowed.', type: 'error' });
    }

    const result = await login({ userEmail, userPassword });
    
    if (result.success) {
      setToast({ message: 'Login success!', type: 'success' });
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);
    } else {
      setToast({ message: 'Login failed! Invalid Email or Password', type: 'error' });
    }
  };

  const handleGuest = (e) => {
    e.preventDefault();
    login(null, true); 
    setToast({ message: 'Guest login success!', type: 'success' });
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-hero-section">
        <img 
          src={BayanLinkLogo} 
          alt="BayanLink Logo" 
          className="auth-logo" 
        />
        <h1>Welcome to BayanLink</h1>
        <p style={{ lineHeight: '1.6', maxWidth: '80%' }}>
          Your centralized community portal for seamless barangay transactions. 
          Request documents, schedule appointments, and stay updated with the latest 
          announcements directly from your local officials.
        </p>
      </div>

      <div className="auth-form-section">
        <div className="auth-card">
          <h2>Login</h2>
          <p className="auth-subtitle">Please enter your details to sign in.</p>
          <form className="auth-form" onSubmit={handleLogin}>
            <div className="input-group">
              <label>Email Address</label>
              <input 
                className="auth-input" 
                type="email" 
                value={userEmail}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com" 
                required
              />
            </div>
            
            <div className="input-group">
              <label>Password</label>
              <div className="password-input-wrapper">
                <input 
                  className="auth-input" 
                  type={showPassword ? "text" : "password"} 
                  value={userPassword}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="*********" 
                  required
                />
                <button 
                  type="button" 
                  className="password-toggle" 
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>

            <button type="submit" className="auth-btn btn-primary">Sign In</button>
            <button type="button" className="auth-btn btn-guest" onClick={handleGuest}>
              Continue as Guest
            </button>
            <div className="auth-footer">
              Don't have an account? <Link to="/register" className="auth-link">Register</Link>
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

export default Login;