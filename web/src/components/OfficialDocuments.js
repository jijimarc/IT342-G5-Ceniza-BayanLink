import React, { useState } from 'react';
import Sidebar from './reusable/Sidebar';
import './reusable/Dashboard.css'; 
import './reusable/OfficialClinic.css'; 
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import Toast from './reusable/Toast';

const OfficialDocuments = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [toast, setToast] = useState({ message: '', type: '' });
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [documentRequests, setDocumentRequests] = useState([
    { 
      id: 'REQ-001', 
      name: 'Juan Dela Cruz', 
      type: 'Barangay Clearance', 
      urgency: 'Standard', 
      date: '2026-04-10', 
      purpose: 'Pre-employment requirement for a new job.',
      idType: 'Driver\'s License',
      status: 'Pending' 
    },
    { 
      id: 'REQ-002', 
      name: 'Maria Clara', 
      type: 'Business Permit', 
      urgency: 'Emergency', 
      date: '2026-04-10', 
      purpose: 'Renewal deadline is tomorrow.',
      idType: 'Passport',
      status: 'Pending' 
    },
  ]);

  const handleLogoutClick = () => {
    logout();
    navigate('/login');
  };

  const handleReviewClick = (doc) => {
    setSelectedDoc(doc);
  };

  const handleUpdateStatus = (id, newStatus) => {
    setDocumentRequests(documentRequests.map(doc => 
      doc.id === id ? { ...doc, status: newStatus } : doc
    ));
    
    setSelectedDoc(null);
    setToast({ 
      message: `Request ${id} marked as ${newStatus}.`, 
      type: newStatus === 'Rejected' ? 'error' : 'success' 
    });
  };

  return (
    <div className="dashboard-wrapper">
      <Sidebar onLogout={handleLogoutClick} />
      
      <main className="main-content">
        <header className="dashboard-header">
          <div className="header-title">
            <h2>Document Requests</h2>
          </div>
          <div className="profile-section">
            <div className="profile-details" onClick={() => navigate('/profile')} style={{ cursor: 'pointer' }}>
              <span className="profile-name">{user?.fullname || "Official User"}</span>
              <span className="profile-role">Official</span>
            </div>
          </div>
        </header>

        <section className="dashboard-body">
          
          <div className="dashboard-card">
            <h3 className="card-title">Pending Requests</h3>
            <p className="card-subtitle" style={{ marginBottom: '20px' }}>Review documents and verify resident IDs.</p>
            
            <div className="table-responsive">
              <table className="official-table">
                <thead>
                  <tr>
                    <th>Ref Number</th>
                    <th>Resident Name</th>
                    <th>Document Type</th>
                    <th>Urgency</th>
                    <th>Date Requested</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {documentRequests.filter(doc => doc.status === 'Pending').map((doc, index) => (
                    <tr key={index}>
                      <td><span className="ref-badge">{doc.id}</span></td>
                      <td className="fw-600">{doc.name}</td>
                      <td>{doc.type}</td>
                      <td>
                        <span style={{ 
                          color: doc.urgency === 'Emergency' ? '#ef4444' : doc.urgency === 'Rush' ? '#f59e0b' : '#64748b',
                          fontWeight: doc.urgency !== 'Standard' ? '600' : 'normal'
                        }}>
                          {doc.urgency}
                        </span>
                      </td>
                      <td>{doc.date}</td>
                      <td>
                        <button 
                          className="btn-action approve" 
                          onClick={() => handleReviewClick(doc)}
                        >
                          Review & Verify
                        </button>
                      </td>
                    </tr>
                  ))}
                  {documentRequests.filter(doc => doc.status === 'Pending').length === 0 && (
                    <tr><td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>No pending requests right now.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </section>
      </main>

      {/* --- THE VERIFICATION MODAL --- */}
      {selectedDoc && (
        <div className="modal-overlay" onClick={() => setSelectedDoc(null)}>
          <div className="modal-content large-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Verify Request: {selectedDoc.id}</h3>
              <button className="close-btn" onClick={() => setSelectedDoc(null)}>&times;</button>
            </div>
            
            <div className="modal-body doc-review-body">
              <div className="doc-details-col">
                <h4 style={{ marginTop: 0 }}>Request Details</h4>
                <p><strong>Resident:</strong> {selectedDoc.name}</p>
                <p><strong>Document:</strong> {selectedDoc.type}</p>
                <p><strong>Urgency:</strong> {selectedDoc.urgency}</p>
                <div className="purpose-box">
                  <strong>Purpose:</strong>
                  <p>{selectedDoc.purpose}</p>
                </div>
              </div>
              
              <div className="doc-id-col">
                <h4 style={{ marginTop: 0 }}>ID Verification</h4>
                <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Provided: {selectedDoc.idType}</p>
                {/* Mock Image Box for the ID */}
                <div className="id-image-placeholder">
                  <span style={{ color: '#94a3b8' }}>[ Uploaded ID Image preview will appear here ]</span>
                </div>
              </div>
            </div>

            <div className="modal-footer" style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', padding: '16px 24px', borderTop: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
              <button 
                className="btn-action reject" 
                onClick={() => handleUpdateStatus(selectedDoc.id, 'Rejected')}
              >
                Reject Request
              </button>
              <button 
                className="btn-action complete" 
                onClick={() => handleUpdateStatus(selectedDoc.id, 'Ready for Pickup')}
              >
                Mark "Ready for Pickup"
              </button>
            </div>
          </div>
        </div>
      )}

      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: '' })} />
    </div>
  );
};

export default OfficialDocuments;