import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from './AuthContext'; 
import './reusable/AuthPage.css';
import Toast from './reusable/Toast';

const Login = () => {  
  const [toast, setToast] = useState({ message: '', type: '' });
  const navigate = useNavigate();
  const { login } = useAuth(); 
  const [userEmail, setEmail] = useState('');
  const [userPassword, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    const result = await login({ userEmail, userPassword });
    
    if (result.success) {
      setToast({ message: 'Login success!', type: 'success' });
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
    } else {
      setToast({ message: 'Login success!', type: 'success' });
    }
  };

  const handleGuest = (e) => {
    e.preventDefault();
    login(null, true); 
    setToast({ message: 'Guest login success!', type: 'success' });
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-hero-section">
        <h1>Welcome</h1>
        <p>Access your dashboard and manage your services efficiently.</p>
      </div>

      <div className="auth-form-section">
        <div className="auth-card">
          <h2>Login</h2>
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
              <input 
                className="auth-input" 
                type="password" 
                value={userPassword}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="*********" 
                required
              />
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