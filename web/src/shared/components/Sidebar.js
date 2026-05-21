import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Sidebar.css';
import { useAuth } from '../context/AuthContext'; 
import Toast from './Toast';
import NotificationModal from './NotificationModal'; 
import { API_BASE_URL } from '../../shared/utils/config';

const BellIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="nav-icon" style={{ display: 'inline-block', marginRight: '12px' }}>
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
  </svg>
);

const Sidebar = ({ onLogout }) => {
  const { user, token, logout } = useAuth();
  const isOfficial = user?.role === 'Official';
  const isAdmin = user?.role === 'Admin';
  const isResident = user?.role === 'Resident'; 
  const [hasUnread, setHasUnread] = useState(false);
  const [currentAlertCount, setCurrentAlertCount] = useState(0);
  const [toast, setToast] = useState({ message: '', type: '' });
  const [isNotificationOpen, setIsNotificationOpen] = useState(false); 
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.isGuest || !token || !isResident) return;

    const fetchDocs = fetch(`${API_BASE_URL}/api/documents/user/${user.userId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    }).then(res => res.ok ? res.json() : []);

    const fetchAppts = fetch(`${API_BASE_URL}/api/appointments/user/${user.userId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    }).then(res => res.ok ? res.json() : []);

    Promise.all([fetchDocs, fetchAppts])
      .then(([docsData, apptsData]) => {
        let totalAlerts = 0;

        if (Array.isArray(docsData)) {
          totalAlerts += docsData.filter(doc => doc.status === 'READY_FOR_PICKUP' || doc.status === 'REJECTED').length;
        }
        if (Array.isArray(apptsData)) {
          totalAlerts += apptsData.filter(appt => appt.status === 'APPROVED' || appt.status === 'REJECTED').length;
        }

        setCurrentAlertCount(totalAlerts);
        const viewedCount = parseInt(localStorage.getItem(`viewedAlerts_${user.userId}`) || '0', 10);

        setHasUnread(totalAlerts > viewedCount);
      })
      .catch(err => console.error("Error updating sidebar badge:", err));
  }, [user, token, isResident]);

  const handleStandardizedLogout = (e) => {
    e.preventDefault();
    setToast({ message: 'Logging out successfully...', type: 'info' });
    setTimeout(() => {
      logout();
      navigate('/login');
    }, 1000);
  };

  const handleOpenNotifications = () => {
    setIsNotificationOpen(true);
    setHasUnread(false);
    localStorage.setItem(`viewedAlerts_${user.userId}`, currentAlertCount.toString());
  };

  return (
    <>
      <aside className="sidebar">
        <div className="sidebar-logo">
          <span className="logo-icon"></span>
          <span>BayanLink Services</span>
        </div>
        
        <nav className="sidebar-nav">
          
          {user ? (
            <>
              <NavLink to="/dashboard" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                <span className="nav-icon"></span>
                Dashboard
              </NavLink>
              
              <NavLink to="/profile" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                <span className="nav-icon"></span>
                Profile
              </NavLink>

              {isAdmin && (
                 <>
                   <div className="nav-section-label">System</div>
                   <NavLink to="/admin/users" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                     <span className="nav-icon"></span>
                     Manage Users
                   </NavLink>
                 </>
              )}
              
              {isOfficial && (
                <NavLink to="/clinic" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                  <span className="nav-icon"></span>
                  Clinic Management
                </NavLink>
              )}

              {!isAdmin && (
                <>
                  <div className="nav-section-label">Services</div>

                  <NavLink to="/schedules" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                    <span className="nav-icon"></span>
                    {isOfficial ? "Appointments" : "Request Appointment"}
                  </NavLink>

                  <NavLink to="/documents" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                    <span className="nav-icon"></span>
                    {isOfficial ? "Document Requests" : "Request Documents"}
                  </NavLink>
                </>
              )}
              
              <div className="nav-section-label" style={{ marginTop: 'auto' }}>Account</div>
                {isResident && (
                  <div 
                    className="nav-item" 
                    onClick={handleOpenNotifications} 
                    style={{ cursor: 'pointer', position: 'relative' }}
                  >
                    <BellIcon />
                    Notifications

                    {hasUnread && <span className="notification-badge"></span>}
                  </div>
                )}

              <NavLink 
                to="/login" 
                className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
                onClick={handleStandardizedLogout}
              >
                <span className="nav-icon"></span>
                Logout
              </NavLink>
            </>
          ) : (
            <NavLink to="/login" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
              <span className="nav-icon"></span>
              Login / Register
            </NavLink>
          )}
        </nav>

        <div className="sidebar-footer">
          <div className="version-tag">v1.0.0 Desktop</div>
        </div>
        <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: '' })} />
      </aside>
      <NotificationModal 
        isOpen={isNotificationOpen} 
        onClose={() => setIsNotificationOpen(false)} 
      />
    </>
  );
};

export default Sidebar;