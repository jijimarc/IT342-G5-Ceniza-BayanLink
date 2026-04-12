import React, { useState } from 'react';
import Sidebar from './reusable/Sidebar';
import './reusable/Dashboard.css'; 
import './reusable/OfficialDashboard.css'; 
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import Toast from './reusable/Toast';

const OfficialDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [toast, setToast] = useState({ message: '', type: '' });

  const displayName = user?.fullname || "Official User";

  // --- MOCK STATE ---
  const [announcements, setAnnouncements] = useState([
    { id: 1, date: '2026-04-10', text: 'Free Polio Vaccination at the main health center this Friday. Please bring your health cards.' },
    { id: 2, date: '2026-04-09', text: 'Barangay Hall will be closed for regular processing on Monday due to the national holiday.' }
  ]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState('');

  // Quick Stats (In the future, fetch these from your backend)
  const pendingDocsCount = 5;
  const todayAppointmentsCount = 8;

  // --- HANDLERS ---
  const handleLogoutClick = () => {
    setToast({ message: 'Logging out successfully...', type: 'info' });
    setTimeout(() => {
      logout();
      navigate('/login');
    }, 1500);
  };

  const handlePostAnnouncement = (e) => {
    e.preventDefault();
    if (!newAnnouncement.trim()) return;

    const newPost = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      text: newAnnouncement
    };

    setAnnouncements([newPost, ...announcements]);
    setNewAnnouncement('');
    setIsModalOpen(false);
    setToast({ message: 'Announcement posted to the community!', type: 'success' });
  };

  return (
    <div className="dashboard-wrapper">
      <Sidebar onLogout={handleLogoutClick} />
      
      <main className="main-content">
        <header className="dashboard-header">
          <div className="header-title">
            <h2>Official Dashboard</h2>
          </div>
          
          <div className="profile-section">
            <div className="profile-details" onClick={() => navigate('/profile')} style={{ cursor: 'pointer' }}>
              <span className="profile-name">{displayName}</span>
              <span className="profile-role">Official</span>
            </div>
          </div>
        </header>

        <section className="dashboard-body">
          
          {/* TOP SECTION: Announcements Board */}
          <div className="dashboard-card" style={{ marginBottom: '24px' }}>
            <div className="card-header-flex">
              <h3 className="card-title">Community Announcements</h3>
              <button className="btn-submit btn-sm" onClick={() => setIsModalOpen(true)}>
                + Post Announcement
              </button>
            </div>
            
            <div className="announcements-container">
              {announcements.length > 0 ? (
                <ul className="announcement-list">
                  {announcements.map((item) => (
                    <li key={item.id} className="announcement-item">
                      <span className="announcement-date">{item.date}</span>
                      <p className="announcement-text">{item.text}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="empty-state-box">
                  <p>No active announcements.</p>
                </div>
              )}
            </div>
          </div>

          {/* BOTTOM SECTION: Quick Actions / Stats Grid */}
          <div className="quick-actions-grid">
            
            {/* Documents Action Card */}
            <div className="dashboard-card action-card">
              <div className="action-card-content">
                <div className="action-icon doc-icon">📄</div>
                <div className="action-details">
                  <h3>Pending Documents</h3>
                  <p className="stat-highlight">{pendingDocsCount} Requests</p>
                  <p className="action-desc">Require ID verification and processing.</p>
                </div>
              </div>
              <button 
                className="btn-action-full primary"
                onClick={() => navigate('/documents')}
              >
                Review Pending Documents
              </button>
            </div>

            {/* Schedules Action Card */}
            <div className="dashboard-card action-card">
              <div className="action-card-content">
                <div className="action-icon sched-icon">📅</div>
                <div className="action-details">
                  <h3>Today's Appointments</h3>
                  <p className="stat-highlight">{todayAppointmentsCount} Scheduled</p>
                  <p className="action-desc">Clinic visits and Captain counseling.</p>
                </div>
              </div>
              <button 
                className="btn-action-full primary"
                onClick={() => navigate('/schedules')}
              >
                View Daily Schedule
              </button>
            </div>

          </div>

        </section>
      </main>

      {/* --- POST ANNOUNCEMENT MODAL --- */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Post New Announcement</h3>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}>&times;</button>
            </div>
            
            <form onSubmit={handlePostAnnouncement}>
              <div className="modal-body">
                <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '16px' }}>
                  This announcement will be visible on the Resident Dashboard instantly.
                </p>
                <div className="form-group">
                  <label>Announcement Message</label>
                  <textarea 
                    className="form-control textarea-control"
                    rows="4"
                    placeholder="Type the news of the day or week here..."
                    value={newAnnouncement}
                    onChange={(e) => setNewAnnouncement(e.target.value)}
                    required
                  ></textarea>
                </div>
              </div>

              <div className="modal-footer" style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', padding: '16px 24px', backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
                <button type="button" className="btn-remove" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-submit">Post to Community</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: '' })} />
    </div>
  );
};

export default OfficialDashboard;