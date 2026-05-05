import React, { useState } from 'react'; 
import Sidebar from '../../shared/components/Sidebar'; 
import '../../shared/components/Layout.css'; 
import './Dashboard.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../shared/context/AuthContext'; 
import Toast from '../../shared/components/Toast';
import { DocumentIcon } from '../../shared/components/Icons';

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
          {user?.isGuest && (
            <div className="guest-banner">
              You are viewing this as a Guest. Some features may be limited.
            </div>
          )}

          <div className="dashboard-card">
            <h3 className="card-title">Announcements</h3>
            <div className="announcements-placeholder">
              <p className="placeholder-text">No new announcements at this time.</p>
            </div>
          </div>

          <div className="clinic-status-row">
            <div className="dashboard-card clinic-staff-card">
              <h3 className="card-title">Staff Present</h3>
              <div className="staff-chips-container">
                <div className="staff-chip">
                  <div className="staff-avatar">RR</div>
                  <div className="staff-info">
                    <span className="staff-name">Ricardo Reyes</span>
                    <span className="staff-dept">Head Physician</span>
                  </div>
                </div>
                <div className="staff-chip">
                  <div className="staff-avatar">ES</div>
                  <div className="staff-info">
                    <span className="staff-name">Elena Santos</span>
                    <span className="staff-dept">Nurse</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="dashboard-card clinic-services-card">
              <h3 className="card-title">Available Services</h3>
              <div className="services-badges">
                <span className="service-badge active">Consultation</span>
                <span className="service-badge active">Vaccination</span>
                <span className="service-badge active">First Aid</span>
                <span className="service-badge inactive">Dental Check</span>
              </div>
            </div>
          </div>
          <div className="dashboard-bottom-row"></div>

          <div className="dashboard-bottom-row">
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