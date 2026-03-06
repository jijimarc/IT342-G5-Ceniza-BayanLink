import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';
import { useAuth } from '../AuthContext';

const Sidebar = ({ onLogout }) => {
  const { user } = useAuth();
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <span className="logo-icon"></span>
        <span>Application Name</span>
      </div>
      
      <nav className="sidebar-nav">
        <NavLink to="/dashboard" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
          <span className="nav-icon"></span>
          Dashboard
        </NavLink>
        
        <NavLink to="/profile" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
          <span className="nav-icon"></span>
          Profile
        </NavLink>

        <div className="nav-section-label">Services</div>

        <NavLink 
          to="/login" 
          className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
          onClick={(e) => {
            e.preventDefault(); 
            if (onLogout) onLogout(); 
          }}
        >
          <span className="nav-icon"></span>
          Logout
        </NavLink>
        
      </nav>

      <div className="sidebar-footer">
        <div className="version-tag">v1.0.0 Desktop</div>
      </div>
    </aside>
  );
};

export default Sidebar;