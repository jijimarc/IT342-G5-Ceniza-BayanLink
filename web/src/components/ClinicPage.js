import React, { useState } from 'react';
import Sidebar from './reusable/Sidebar';
import './reusable/Dashboard.css'; 
import './reusable/Clinic.css'; 
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import Toast from './reusable/Toast';
import { StaffIcon } from './reusable/Icons';

const Clinic = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [toast, setToast] = useState({ message: '', type: '' });
  const displayName = user?.isGuest ? "Guest User" : (user?.fullname || user?.email || "User");

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
            <h2>Clinic</h2>
          </div>
          
          {/* Using your updated clean profile section (no avatar circle) */}
          <div className="profile-section">
            <div className="profile-details" onClick={() => navigate('/profile')} style={{ cursor: 'pointer' }}>
              <span className="profile-name">{displayName}</span>
              <span className="profile-role">{user?.isGuest ? 'Guest' : (user?.role || 'User')}</span>
            </div>
          </div>
        </header>

        <section className="dashboard-body">
          
          {/* Staff Present Section */}
          <div className="dashboard-card">
            <h3 className="card-title">Staff Present</h3>
            <div className="staff-grid">
              
              {/* Staff Member 1 */}
              <div className="staff-card">
                <div className="staff-icon-wrapper">
                  <StaffIcon />
                </div>
                <div className="staff-info">
                  <span className="staff-name">Dr. Reyes</span>
                  <span className="staff-title">Head Physician</span>
                </div>
              </div>

              {/* Staff Member 2 */}
              <div className="staff-card">
                <div className="staff-icon-wrapper">
                  <StaffIcon />
                </div>
                <div className="staff-info">
                  <span className="staff-name">Nurse Santos</span>
                  <span className="staff-title">Registered Nurse</span>
                </div>
              </div>

              {/* Staff Member 3 */}
              <div className="staff-card">
                <div className="staff-icon-wrapper">
                  <StaffIcon />
                </div>
                <div className="staff-info">
                  <span className="staff-name">Dr. Lim</span>
                  <span className="staff-title">Pediatrician</span>
                </div>
              </div>

            </div>
          </div>

          {/* Services Available Section */}
          <div className="dashboard-card">
            <h3 className="card-title">Services Available</h3>
            <div className="services-list-container">
              <ul className="services-list">
                <li>General Consultation</li>
                <li>Blood Pressure Monitoring</li>
                <li>Vaccination Administration</li>
                <li>First Aid & Wound Dressing</li>
                <li>Maternal Health Check-up</li>
              </ul>
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

export default Clinic;