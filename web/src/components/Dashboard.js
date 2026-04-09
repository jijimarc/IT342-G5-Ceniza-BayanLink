import React, { useState } from 'react'; 
import Sidebar from './reusable/Sidebar'; 
import './reusable/Dashboard.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext'; 
import Toast from './reusable/Toast';
import { DocumentIcon } from './reusable/Icons';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth(); 
  const [toast, setToast] = useState({ message: '', type: '' }); 
  const displayName = user?.isGuest ? "Guest User" : (user?.fullname || "User");

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
            <div className="profile-details">
              <span className="profile-name">{displayName}</span>
              <span className="profile-role">{user?.isGuest ? 'Guest' : (user?.role || 'User')}</span>
            </div>
          </div>
        </header>

        <section className="dashboard-body">
          {/* Guest Warning Banner */}
          {user?.isGuest && (
            <div className="guest-banner">
              You are viewing this as a Guest. Some features may be limited.
            </div>
          )}

          {/* Announcements Section */}
          <div className="dashboard-card">
            <h3 className="card-title">Announcements</h3>
            <div className="announcements-placeholder">
              <p className="placeholder-text">No new announcements at this time.</p>
            </div>
          </div>

          {/* Pending Documents Section */}
          <div className="dashboard-bottom-row">
            
            {/* Left Half: Pending Documents */}
            <div className="dashboard-card">
              <h3 className="card-title">Pending Documents</h3>
              <div className="documents-grid">
                
                <div className="document-item">
                  <div className="document-icon-wrapper">
                    <DocumentIcon />
                  </div>
                  <span className="document-label">Barangay Certificate</span>
                </div>

                <div className="document-item">
                  <div className="document-icon-wrapper">
                    <DocumentIcon />
                  </div>
                  <span className="document-label">Health Certificate</span>
                </div>

                <div className="document-item">
                  <div className="document-icon-wrapper">
                    <DocumentIcon />
                  </div>
                  <span className="document-label">Tax Certificate</span>
                </div>

              </div>
            </div>

            {/* Right Half: Pending Appointments */}
            <div className="dashboard-card">
              <h3 className="card-title">Pending Appointments</h3>
              <div className="appointments-placeholder">
                <p className="placeholder-text">No pending appointments.</p>
              </div>
            </div>

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