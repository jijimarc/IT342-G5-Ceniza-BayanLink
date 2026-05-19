import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from '../../shared/components/Sidebar';
import '../../shared/components/Layout.css'; 
import '../dashboard/Dashboard.css'; 
import { useAuth } from '../../shared/context/AuthContext';
import Toast from '../../shared/components/Toast';

const AdminDashboard = () => {
  const { user, token } = useAuth();
  const [toast, setToast] = useState({ message: '', type: '' });
  const displayName = user?.fullname || "System Admin";
  
  const [announcements, setAnnouncements] = useState([]);
  const [stats, setStats] = useState({ residents: 0, officials: 0 });
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAnnouncementTitle, setNewAnnouncementTitle] = useState('');
  const [newAnnouncementContent, setNewAnnouncementContent] = useState('');

  const fetchAnnouncements = useCallback(() => {
    fetch('http://localhost:8080/api/announcements', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setAnnouncements(data))
      .catch(err => console.error("Error fetching announcements:", err));
  }, [token]);

  useEffect(() => {
    if (!token) return;
    fetchAnnouncements();

    const fetchStats = async () => {
      try {
        const resResident = await fetch('http://localhost:8080/api/admin/users?role=RESIDENT', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const resOfficial = await fetch('http://localhost:8080/api/admin/users?role=OFFICIAL', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        const residents = await resResident.json();
        const officials = await resOfficial.json();
        
        setStats({ residents: residents.length, officials: officials.length });
      } catch (error) {
        console.error("Failed to fetch system stats");
      }
    };
    fetchStats();
  }, [token, fetchAnnouncements]);

  const handlePostAnnouncement = async (e) => {
    e.preventDefault();
    if (!newAnnouncementTitle.trim() || !newAnnouncementContent.trim()) return;

    try {
      const response = await fetch('http://localhost:8080/api/announcements', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: `[SYSTEM] ${newAnnouncementTitle}`,
          content: newAnnouncementContent,
          userId: user.userId
        })
      });

      if (response.ok) {
        setNewAnnouncementTitle('');
        setNewAnnouncementContent('');
        setIsModalOpen(false);
        setToast({ message: 'System Notice posted!', type: 'success' });
        fetchAnnouncements(); 
      }
    } catch (error) {
      setToast({ message: 'Network error occurred.', type: 'error' });
    }
  };

  return (
    <div className="dashboard-wrapper">
      <Sidebar />
      <main className="main-content">
        <header className="dashboard-header">
          <div className="header-title">
            <h2>System Administration</h2>
          </div>
          <div className="profile-section">
            <div className="profile-details">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="profile-name">{displayName}</span>
                <div className="status-dot-mini online"></div>
              </div>
              <span className="profile-role">Administrator</span>
            </div>
          </div>
        </header>

        <section className="dashboard-body">
          <div className="quick-actions-grid" style={{ marginBottom: '24px' }}>
            <div className="dashboard-card action-card">
              <div className="action-card-content">
                <div className="action-details">
                  <h3>Registered Residents</h3>
                  <p className="stat-highlight" style={{ fontSize: '2rem', color: '#3b82f6' }}>{stats.residents}</p>
                  <p className="action-desc">Total community members on the platform.</p>
                </div>
              </div>
            </div>

            <div className="dashboard-card action-card">
              <div className="action-card-content">
                <div className="action-details">
                  <h3>Active Staff & Officials</h3>
                  <p className="stat-highlight" style={{ fontSize: '2rem', color: '#10b981' }}>{stats.officials}</p>
                  <p className="action-desc">Barangay employees managing the system.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="card-header-flex">
              <h3 className="card-title">Global System Notices</h3>
              <button className="btn-submit btn-sm" onClick={() => setIsModalOpen(true)}>
                + Post System Notice
              </button>
            </div>
            
            <div className="announcements-container">
              {announcements.length > 0 ? (
                <ul className="announcement-list">
                {announcements.map((item) => (
                    <li key={item.id || item.announcementId} style={{ padding: '12px 0', borderBottom: '1px solid #e2e8f0' }}>
                      <h4 style={{ margin: '0 0 4px 0', color: '#1e293b' }}>{item.title}</h4>
                      <p style={{ margin: '0 0 8px 0', color: '#475569', fontSize: '0.9rem' }}>{item.content}</p>
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
        </section>
      </main>

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
           <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h3>Post System Notice</h3>
              <form onSubmit={handlePostAnnouncement}>
                 <input className="form-control" placeholder="Title" value={newAnnouncementTitle} onChange={(e) => setNewAnnouncementTitle(e.target.value)} required />
                 <textarea className="form-control" style={{marginTop: '10px'}} rows="4" value={newAnnouncementContent} onChange={(e) => setNewAnnouncementContent(e.target.value)} required />
                 <div style={{ marginTop: '15px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                    <button type="button" className="btn-cancel" onClick={() => setIsModalOpen(false)}>Cancel</button>
                    <button type="submit" className="btn-save">Post</button>
                 </div>
              </form>
           </div>
        </div>
      )}
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: '' })} />
    </div>
  );
};

export default AdminDashboard;