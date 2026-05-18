import React, { useState, useEffect } from 'react'; 
import Sidebar from '../../shared/components/Sidebar'; 
import '../../shared/components/Layout.css'; 
import './Dashboard.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../shared/context/AuthContext'; 
import Toast from '../../shared/components/Toast';
import { DocumentIcon } from '../../shared/components/Icons';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, token, logout } = useAuth(); 
  const [toast, setToast] = useState({ message: '', type: '' }); 
  const displayName = user?.isGuest ? "Guest User" : (user?.fullname || "User");

  const [announcements, setAnnouncements] = useState([]);
  const [staffPresent, setStaffPresent] = useState([]);
  const [services, setServices] = useState([]); 
  
  const [pendingDocuments, setPendingDocuments] = useState([]);
  const [pendingAppointments, setPendingAppointments] = useState([]);

  useEffect(() => {
    if (!token || user?.isGuest) return;

    fetch('http://localhost:8080/api/announcements', {
      headers: { 'Authorization': `Bearer ${token}` } 
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch announcements");
        return res.json();
      })
      .then(data => setAnnouncements(data))
      .catch(err => console.error("Error fetching announcements:", err));

    fetch('http://localhost:8080/api/officials/directory', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch staff"); 
        return res.json();
      })
      .then(directory => {
        const presentStaff = directory.filter(official => 
          official.present === true || official.isPresent === true
        );
        setStaffPresent(presentStaff);
      })
      .catch(err => console.error("Error fetching staff:", err));

    fetch('http://localhost:8080/api/clinic-services', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setServices(data))
      .catch(err => console.error("Error fetching services:", err));

    if (user && user.userId) {
      fetch(`http://localhost:8080/api/documents/user/${user.userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => {
          if (!res.ok) throw new Error("Failed to fetch documents");
          return res.json();
        })
        .then(data => {
          const pending = data.filter(doc => 
            !doc.status || doc.status.toUpperCase().includes('PENDING')
          );
          setPendingDocuments(pending);
        })
        .catch(err => console.error("Error fetching documents:", err));

      fetch(`http://localhost:8080/api/appointments/user/${user.userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => {
          if (!res.ok) throw new Error("Failed to fetch appointments");
          return res.json();
        })
        .then(data => {
          const pending = data.filter(apt => 
            !apt.status || apt.status.toUpperCase() === 'PENDING'
          );
          setPendingAppointments(pending);
        })
        .catch(err => console.error("Error fetching appointments:", err));
    }
  }, [token, user]);

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
            <h2>Resident Dashboard</h2>
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
            {announcements.length > 0 ? (
              <ul className="announcement-list">
                {announcements
                  .filter(item => {
                    if (!item.createdAt) return true; 
                    const postDate = new Date(item.createdAt);
                    const today = new Date();
                    return postDate.toDateString() === today.toDateString();
                  })
                  .map((item) => {
                    const postTime = item.createdAt 
                      ? new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
                      : 'Today';

                    return (
                      <li key={item.id || item.announcementId} className="announcement-item" style={{ padding: '12px 0', borderBottom: '1px solid #e2e8f0' }}>
                        <h4 style={{ margin: '0 0 4px 0', color: '#1e293b' }}>{item.title}</h4>
                        <p className="announcement-text" style={{ margin: '0 0 8px 0', color: '#475569', fontSize: '0.9rem' }}>{item.content}</p>
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          Posted at {postTime}
                        </div>
                      </li>
                    );
                  })}
              </ul>
            ) : (
              <div className="announcements-placeholder">
                <p className="placeholder-text">No new announcements at this time.</p>
              </div>
            )}
          </div>

          <div className="clinic-status-row">
            <div className="dashboard-card clinic-staff-card">
              <h3 className="card-title">Staff Present</h3>
              <div className="staff-chips-container">
                {staffPresent.length > 0 ? (
                  staffPresent.map(staff => (
                    <div className="staff-chip" key={staff.userId}>
                      <div className="staff-avatar">{staff.fullName.substring(0, 2).toUpperCase()}</div>
                      <div className="staff-info">
                        <span className="staff-name">{staff.fullName}</span>
                        <span className="staff-dept">{staff.positionTitle}</span>
                      </div>
                    </div>
                  ))
                ) : (
                   <p className="placeholder-text" style={{ fontSize: '0.85rem' }}>No staff present.</p>
                )}
              </div>
            </div>

            <div className="dashboard-card clinic-services-card">
              <h3 className="card-title">Available Services</h3>
              <div className="services-badges">
                {services.map(svc => {
                  const isAvailable = svc.available !== undefined ? svc.available : svc.isAvailable;
                  return (
                    <span key={svc.id} className={`service-badge ${isAvailable ? 'active' : 'inactive'}`}>
                      {svc.serviceName}
                    </span>
                  );
                })}
                {services.length === 0 && <p className="placeholder-text" style={{ fontSize: '0.85rem' }}>No services posted.</p>}
              </div>
            </div>
          </div>

          <div className="dashboard-bottom-row">
            <div className="dashboard-card">
              <h3 className="card-title">Pending Documents</h3>
              {pendingDocuments.length > 0 ? (
                <div className="documents-grid">
                  {pendingDocuments.map((doc, index) => (
                    <div className="document-item" key={index}>
                      <div className="document-icon-wrapper">
                        <DocumentIcon />
                      </div>
                      <span className="document-label">{doc.documentType}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="appointments-placeholder">
                  <p className="placeholder-text">No pending documents.</p>
                </div>
              )}
            </div>

            <div className="dashboard-card">
              <h3 className="card-title">Pending Appointments</h3>
              {pendingAppointments.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {pendingAppointments.map((apt, index) => (
                    <div key={index} style={{ padding: '12px', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                      <p style={{ margin: '0 0 4px 0', fontWeight: '600', color: '#1e293b' }}>{apt.serviceRequested || apt.serviceType || 'Clinic Visit'}</p>
                      <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>{apt.appointmentDate} • {apt.timeSlot}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="appointments-placeholder">
                  <p className="placeholder-text">No pending appointments.</p>
                </div>
              )}
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