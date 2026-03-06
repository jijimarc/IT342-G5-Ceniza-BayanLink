import React, { useState } from 'react'; 
import Sidebar from './reusable/Sidebar'; 
import './reusable/Dashboard.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext'; 
import Toast from './reusable/Toast';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth(); 
  const [toast, setToast] = useState({ message: '', type: '' }); 
  
  const getInitials = (name) => {
    if (!name) return "G";
    const parts = name.split(" ");
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
  };

  const displayName = user?.isGuest ? "Guest User" : (user?.email || "User");
  const avatarText = user?.isGuest ? "G" : getInitials(displayName);

  const handleLogoutClick = () => {
    setToast({ message: 'Logging out successfully...', type: 'info' });
    setTimeout(() => {
      logout(); 
      navigate('/login'); 
    }, 1500);
  };

  return (
    <div className="dashboard-wrapper">
      <Sidebar onLogout={handleLogoutClick} />
      
      <main className="main-content">
        <header className="dashboard-header">
          <div className="header-title">
            <h2>Dashboard Overview</h2>
          </div>
          
          <div className="profile-section">
            <button className="profile-btn" onClick={() => navigate('/profile')}>
              <div className={`profile-avatar ${user?.isGuest ? 'guest-avatar' : ''}`}>
                {avatarText}
              </div>
              <span>{displayName}</span>
            </button>
          </div>
        </header>

        <section className="dashboard-body">
          <div className="empty-state">
            <p>Dashboard: Statistics and Overview will go here.</p>
            {user?.isGuest && (
                <small style={{display: 'block', marginTop: '10px', color: '#666'}}>
                    (You are viewing this as a Guest. Some features may be limited.)
                </small>
            )}
          </div>
        </section>
      </main>
      <Toast 
        message={toast.message} 
        type={toast.type} 
        onClose={() => setToast({ message: '', type: '' })} 
      />
    </div>
  );
};

export default Dashboard;