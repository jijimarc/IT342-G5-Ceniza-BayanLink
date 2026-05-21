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
                title: doc.documentType,
                message: doc.status === 'READY_FOR_PICKUP' 
                  ? 'Your document has been processed and is ready.' 
                  : 'Your document request was declined.',
                status: doc.status, 
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
                title: 'Appointment Update',
                message: appt.status === 'APPROVED'
                  ? 'Your appointment is confirmed and scheduled.'
                  : 'Your appointment request was declined.',
                status: appt.status, 
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
            <p className="notification-state-text">Loading updates...</p>
          ) : notifications.length > 0 ? (
            <div className="notification-list">
              {notifications.map(note => (
                <div key={note.id} className={`notification-card ${note.type}`}>
                  <div className="notification-card-header">
                    <strong>{note.title}</strong>
                    <span className={`notification-status-badge ${note.type}`}>
                      {note.status ? note.status.replaceAll('_', ' ') : ''}
                    </span>
                  </div>
                  <p className="notification-message">{note.message}</p>
                  <small className="notification-date">{note.date}</small>
                </div>
              ))}
            </div>
          ) : (
            <div className="notification-empty-state">
              <p className="notification-empty-title">No new updates right now.</p>
              <p className="notification-empty-subtitle">You're all caught up!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;