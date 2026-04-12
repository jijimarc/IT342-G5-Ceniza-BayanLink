import React, { useState, useEffect } from 'react';
import Sidebar from './reusable/Sidebar';
import './reusable/Dashboard.css'; 
import './reusable/Clinic.css'; 
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import Toast from './reusable/Toast';
import { StaffIcon } from './reusable/Icons';

const Clinic = () => {
  const navigate = useNavigate();
  const { user, token, logout } = useAuth(); 
  const [toast, setToast] = useState({ message: '', type: '' });
  const [healthStaff, setHealthStaff] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const displayName = user?.isGuest ? "Guest User" : (user?.fullname || user?.email || "User");

  useEffect(() => {
    const fetchHealthStaff = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/officials/directory', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const directory = await response.json();
          const medicalKeywords = ['physician', 'nurse', 'pediatrician', 'health', 'doctor'];
          const filteredStaff = directory.filter(official => 
            medicalKeywords.some(keyword => 
              official.positionTitle?.toLowerCase().includes(keyword)
            )
          );
          
          setHealthStaff(filteredStaff);
        } else {
          console.error("Failed to fetch directory");
        }
      } catch (error) {
        console.error("Network error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      fetchHealthStaff();
    }
  }, [token]);

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
          
          <div className="profile-section">
            <div className="profile-details" onClick={() => navigate('/profile')} style={{ cursor: 'pointer' }}>
              <span className="profile-name">{displayName}</span>
              <span className="profile-role">{user?.isGuest ? 'Guest' : (user?.role || 'User')}</span>
            </div>
          </div>
        </header>

        <section className="dashboard-body">
          
          <div className="dashboard-card">
            <h3 className="card-title">Staff Present</h3>
            
            {isLoading ? (
              <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Loading clinic staff...</p>
            ) : healthStaff.length > 0 ? (
              <div className="staff-grid">
                {healthStaff.map((staff, index) => (
                  <div className="staff-card" key={index}>
                    <div className="staff-icon-wrapper">
                      <StaffIcon />
                    </div>
                    <div className="staff-info">
                      <span className="staff-name">{staff.fullName}</span>
                      <span className="staff-title">{staff.positionTitle}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: '#64748b', fontSize: '0.9rem' }}>No medical staff are currently listed.</p>
            )}
          </div>

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