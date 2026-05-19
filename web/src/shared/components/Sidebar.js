import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Sidebar.css';
import { useAuth } from '../context/AuthContext'; 
import Toast from './Toast';

const Sidebar = ({ onLogout }) => {
  const { user, logout } = useAuth();
  const isOfficial = user?.role === 'Official';
  const isAdmin = user?.role === 'Admin';
  const [toast, setToast] = useState({ message: '', type: '' });
  const navigate = useNavigate();

  const handleStandardizedLogout = (e) => {
    e.preventDefault();
    setToast({ message: 'Logging out successfully...', type: 'info' });
    setTimeout(() => {
      logout();
      navigate('/login');
    }, 1000);
  };

  return (
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
  );
};

export default Sidebar;