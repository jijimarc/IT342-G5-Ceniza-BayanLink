import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../utils/config';
import './Notification.css';

const NotificationModal = ({ isOpen, onClose }) => {
  const { user, token } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || !user || user.isGuest) return;

    setIsLoading(true);

    const fetchDocs = fetch(`${API_BASE_URL}/api/documents/user/${user.userId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    }).then(res => res.ok ? res.json() : []);

    const fetchAppts = fetch(`${API_BASE_URL}/api/appointments/user/${user.userId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    }).then(res => res.ok ? res.json() : []);

    Promise.all([fetchDocs, fetchAppts])
      .then(([docsData, apptsData]) => {
        const alerts = [];

        if (Array.isArray(docsData)) {
          docsData.forEach(doc => {
            if (doc.status === 'READY_FOR_PICKUP' || doc.status === 'REJECTED') {
              alerts.push({
                id: `doc-${doc.requestId}`,
                title: doc.status === 'READY_FOR_PICKUP' ? 'Document Ready' : 'Document Rejected',
                message: doc.status === 'READY_FOR_PICKUP' 
                  ? `Your request for ${doc.documentType} has been processed!` 
                  : `Your request for ${doc.documentType} was rejected.`,
                type: doc.status === 'READY_FOR_PICKUP' ? 'success' : 'error',
                date: doc.requestDate
              });
            }
          });
        }

        if (Array.isArray(apptsData)) {
          apptsData.forEach(appt => {
            if (appt.status === 'APPROVED' || appt.status === 'REJECTED') {
              alerts.push({
                id: `appt-${appt.appointmentId || appt.id || Math.random()}`,
                title: appt.status === 'APPROVED' ? 'Appointment Approved' : 'Appointment Rejected',
                message: appt.status === 'APPROVED'
                  ? `Your appointment is confirmed and scheduled.`
                  : `Your appointment request was declined.`,
                type: appt.status === 'APPROVED' ? 'success' : 'error',
                date: appt.appointmentDate || appt.date || 'Recently'
              });
            }
          });
        }

        setNotifications(alerts);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Error fetching unified notifications:", err);
        setIsLoading(false);
      });
  }, [isOpen, user, token]);

  if (!isOpen) return null;

  return (
    <div className="notification-modal-overlay" onClick={onClose}>
      <div className="notification-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Notifications</h3>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-body">
          {isLoading ? (
            <p style={{ textAlign: 'center', color: '#64748b', padding: '20px' }}>Loading updates...</p>
          ) : notifications.length > 0 ? (
            <div className="notification-list">
              {notifications.map(note => (
                <div key={note.id} className={`notification-card ${note.type}`}>
                  <strong>{note.title}</strong>
                  <p>{note.message}</p>
                  <small>{note.date}</small>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
              <p style={{ margin: '0 0 8px 0', fontWeight: 'bold' }}>No new updates right now.</p>
              <p style={{ margin: 0, fontSize: '0.85rem' }}>You're all caught up!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;