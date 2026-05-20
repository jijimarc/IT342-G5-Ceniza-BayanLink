import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from '../../shared/components/Sidebar';
import '../../shared/components/Layout.css'; 
import './Dashboard.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../shared/context/AuthContext';
import Toast from '../../shared/components/Toast';
import { API_BASE_URL } from '../../shared/utils/config';

const OfficialDashboard = () => {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [toast, setToast] = useState({ message: '', type: '' });
  const displayName = user?.fullname || "Official User";
  const [announcements, setAnnouncements] = useState([]);
  const [staffPresent, setStaffPresent] = useState([]);
  const [services, setServices] = useState([]);
  const [pendingDocsCount, setPendingDocsCount] = useState(0);
  const [todayAppointmentsCount, setTodayAppointmentsCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAnnouncementTitle, setNewAnnouncementTitle] = useState('');
  const [newAnnouncementContent, setNewAnnouncementContent] = useState('');

  const fetchAnnouncements = useCallback(() => {
    fetch(`${API_BASE_URL}/api/announcements`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch announcements");
        return res.json();
      })
      .then(data => setAnnouncements(data))
      .catch(err => console.error("Error fetching announcements:", err));
  }, [token]);

  useEffect(() => {
    if (!token) return;
    fetchAnnouncements();
    fetch(`${API_BASE_URL}/api/officials/directory`, {
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

    fetch(`${API_BASE_URL}/api/clinic-services`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setServices(data))
      .catch(err => console.error("Error fetching services:", err));

    fetch(`${API_BASE_URL}/api/documents/all`, {
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
         setPendingDocsCount(pending.length);
      })
      .catch(err => console.error("Error fetching docs count:", err));

    const today = new Date().toISOString().split('T')[0];
    fetch(`${API_BASE_URL}/api/appointments/schedule?date=${today}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch schedule");
        return res.json();
      })
      .then(data => setTodayAppointmentsCount(data.length))
      .catch(err => console.error("Error fetching appointments count:", err));

  }, [token, fetchAnnouncements]); 

  const handlePostAnnouncement = async (e) => {
    e.preventDefault();
    if (!newAnnouncementTitle.trim() || !newAnnouncementContent.trim()) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/announcements`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: newAnnouncementTitle,
          content: newAnnouncementContent,
          userId: user.userId
        })
      });

      if (response.ok) {
        setNewAnnouncementTitle('');
        setNewAnnouncementContent('');
        setIsModalOpen(false);
        setToast({ message: 'Announcement posted to the community!', type: 'success' });
        fetchAnnouncements(); 
      } else {
        const errorText = await response.text();
        setToast({ message: `Failed to post: ${errorText}`, type: 'error' });
      }
    } catch (error) {
      console.error("Error posting announcement:", error);
      setToast({ message: 'Network error occurred.', type: 'error' });
    }
  };

  return (
    <div className="dashboard-wrapper">
      <Sidebar />
      <main className="main-content">
        <header className="dashboard-header">
          <div className="header-title">
            <h2>Official Dashboard</h2>
          </div>
          <div className="profile-section">
            <div className="profile-details">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="profile-name">{displayName}</span>
                <div className={`status-dot-mini online`}></div>
              </div>
              <span className="profile-role">Official</span>
            </div>
          </div>
        </header>

        <section className="dashboard-body">
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
                <div className="empty-state-box">
                  <p>No active announcements.</p>
                </div>
              )}
            </div>
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
              <h3 className="card-title">Active Services</h3>
              <div className="services-badges">
                {services.map(svc => {
                  const isAvailable = svc.available !== undefined ? svc.available : svc.isAvailable;
                  return (
                    <span key={svc.id} className={`service-badge ${isAvailable ? 'active' : 'inactive'}`}>
                      {svc.serviceName}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="quick-actions-grid">
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
                  <label>Title</label>
                  <input 
                    type="text"
                    className="form-control"
                    placeholder="e.g., Free Vaccination Drive"
                    value={newAnnouncementTitle}
                    onChange={(e) => setNewAnnouncementTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Announcement Message</label>
                  <textarea 
                    className="form-control textarea-control"
                    rows="4"
                    placeholder="Type the news of the day or week here..."
                    value={newAnnouncementContent}
                    onChange={(e) => setNewAnnouncementContent(e.target.value)}
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