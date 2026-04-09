import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';
import { useAuth } from '../AuthContext';

/**
 * OBSERVER PATTERN IMPLEMENTATION
 * * Subject (Observable): AuthContext (specifically the state inside it).
 * * Observer: This Sidebar component.
 * * Purpose: The Sidebar "subscribes" to the AuthContext. When the authentication 
 * state changes (e.g., user logs in or out), the Context automatically notifies 
 * this component, triggering a re-render to update the navigation links dynamically.
 */
const Sidebar = ({ onLogout }) => {
  // 1. SUBSCRIBING TO THE SUBJECT
  // By calling useAuth(), this component registers itself as an observer.
  const { user } = useAuth();

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <span className="logo-icon"></span>
        <span>BayanLink Services</span>
      </div>
      
      <nav className="sidebar-nav">
        
        {/* 2. REACTING TO STATE CHANGES */}
        {/* The UI dynamically updates based on the observed 'user' state. */}
        {user ? (
          <>
            {/* Links visible only to logged-in users */}
            <NavLink to="/dashboard" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
              <span className="nav-icon"></span>
              Dashboard
            </NavLink>
            
            <NavLink to="/profile" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
              <span className="nav-icon"></span>
              Profile
            </NavLink>

            {/* Example of reacting to specific roles within the observed state */}
            {user.role === 'OFFICIAL' && (
               <NavLink to="/admin-panel" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                 <span className="nav-icon"></span>
                 Admin Panel
               </NavLink>
            )}

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
          </>
        ) : (
          /* Links visible to unauthenticated users */
          <NavLink to="/login" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
            <span className="nav-icon"></span>
            Login / Register
          </NavLink>
        )}
      </nav>

      <div className="sidebar-footer">
        <div className="version-tag">v1.0.0 Desktop</div>
      </div>
    </aside>
  );
};

export default Sidebar;