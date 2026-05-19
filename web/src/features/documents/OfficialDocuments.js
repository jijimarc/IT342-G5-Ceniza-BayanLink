import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from '../../shared/components/Sidebar';
import '../../shared/components/Layout.css'; 
import './Documents.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../shared/context/AuthContext';
import Toast from '../../shared/components/Toast';

const OfficialDocuments = () => {
  const navigate = useNavigate();
  const { user, token, logout } = useAuth();
  const [toast, setToast] = useState({ message: '', type: '' });
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [documentRequests, setDocumentRequests] = useState([]); 
  const [historyRequests, setHistoryRequests] = useState([]); 
  
  const fetchAllDocuments = useCallback(() => {
    if (!token) return;
    fetch('http://localhost:8080/api/documents/all', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        const pending = data.filter(doc => !doc.status || doc.status.toUpperCase() === 'PENDING');
        const history = data.filter(doc => doc.status && doc.status.toUpperCase() !== 'PENDING');
        
        setDocumentRequests(pending);
        setHistoryRequests(history);
      })
      .catch(err => console.error("Error fetching documents:", err));
  }, [token]);

  useEffect(() => {
    fetchAllDocuments();
  }, [token, fetchAllDocuments]);

  const handleLogoutClick = () => {
    logout();
    navigate('/login');
  };

  const handleReviewClick = (doc) => {
    setSelectedDoc(doc);
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const response = await fetch(`http://localhost:8080/api/documents/${id}/status?officialId=${user.userId}&status=${newStatus}`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
        }
      });

      if (response.ok) {
        setToast({ 
          message: `Request ${id} marked as ${newStatus}.`, 
          type: newStatus === 'REJECTED' ? 'error' : 'success' 
        });
        setSelectedDoc(null);
        fetchAllDocuments();
      } else {
        const errorText = await response.text();
        setToast({ message: `Failed to update status: ${errorText}`, type: 'error' });
      }
    } catch (error) {
      console.error("Error updating status:", error);
      setToast({ message: 'Network error occurred.', type: 'error' });
    }
  };

  const handleProcessAndPrint = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/api/documents/${id}/process`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}` 
        }
      });

      if (response.ok) {
        const htmlContent = await response.text();
        const printWindow = window.open('', '_blank', 'width=800,height=900');

        printWindow.document.open();
        printWindow.document.write(htmlContent);
        printWindow.document.close();
        printWindow.onload = () => {
          printWindow.print();
        };

        setToast({ message: `Document generated successfully!`, type: 'success' });
        setSelectedDoc(null);
        fetchAllDocuments(); 
      } else {
        const errorText = await response.text();
        setToast({ message: `Failed to process: ${errorText}`, type: 'error' });
      }
    } catch (error) {
      console.error("Error processing document:", error);
      setToast({ message: 'Network error occurred during generation.', type: 'error' });
    }
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
                  {documentRequests.map((doc, index) => (
                    <tr key={index}>
                      <td><span className="ref-badge">{doc.requestId}</span></td>
                      <td className="fw-600">{doc.residentName || 'Unknown Resident'}</td>
                      <td>{doc.documentType}</td>
                      <td>
                        <span style={{ 
                          color: doc.urgency === 'Emergency' ? '#ef4444' : doc.urgency === 'Rush' ? '#f59e0b' : '#64748b',
                          fontWeight: doc.urgency !== 'Standard' ? '600' : 'normal'
                        }}>
                          {doc.urgency || 'Standard'}
                        </span>
                      </td>
                      <td>{doc.requestDate}</td>
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
                  {documentRequests.length === 0 && (
                    <tr><td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>No pending requests right now.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="dashboard-card" style={{ marginTop: '24px' }}>
            <h3 className="card-title">Processed Requests History</h3>
            <div className="table-responsive">
              <table className="official-table" style={{ opacity: '0.85' }}>
                <thead>
                  <tr>
                    <th>Ref Number</th>
                    <th>Resident Name</th>
                    <th>Document Type</th>
                    <th>Final Status</th>
                    <th>Date Requested</th>
                  </tr>
                </thead>
                <tbody>
                  {historyRequests.map((doc, index) => (
                    <tr key={index}>
                      <td><span className="ref-badge">{doc.requestId}</span></td>
                      <td className="fw-600">{doc.residentName || 'Unknown Resident'}</td>
                      <td>{doc.documentType}</td>
                      <td>
                        <span style={{ 
                          fontWeight: 'bold',
                          color: doc.status === 'REJECTED' ? '#ef4444' : '#16a34a' 
                        }}>
                          {doc.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td>{doc.requestDate}</td>
                    </tr>
                  ))}
                  {historyRequests.length === 0 && (
                    <tr><td colSpan="5" style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>No processed requests yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>

      {selectedDoc && (
        <div className="modal-overlay" onClick={() => setSelectedDoc(null)}>
          <div className="modal-content large-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Verify Request: {selectedDoc.requestId}</h3>
              <button className="close-btn" onClick={() => setSelectedDoc(null)}>&times;</button>
            </div>
            
            <div className="modal-body doc-review-body">
              <div className="doc-details-col">
                <h4 style={{ marginTop: 0 }}>Request Details</h4>
                {/* FIX: Display all the correct backend variables */}
                <p><strong>Resident:</strong> {selectedDoc.residentName || 'Unknown Resident'}</p>
                <p><strong>Document:</strong> {selectedDoc.documentType}</p>
                <p><strong>Urgency:</strong> {selectedDoc.urgency || 'Standard'}</p>
                <div className="purpose-box">
                  <strong>Purpose/Note:</strong>
                  <p>{selectedDoc.purpose || 'No additional notes provided.'}</p>
                </div>
              </div>
              
              <div className="doc-id-col">
                <h4 style={{ marginTop: 0 }}>ID Verification</h4>
                {/* FIX: Use validIdType instead of validId */}
                <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Provided: {selectedDoc.validIdType || 'ID Document'}</p>
                <div className="id-image-placeholder" style={{ padding: 0, overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f1f5f9' }}>
                  {selectedDoc.requirementURL ? (
                    <img 
                      src={selectedDoc.requirementURL} 
                      alt="Resident ID" 
                      style={{ maxWidth: '100%', maxHeight: '250px', objectFit: 'contain' }} 
                    />
                  ) : (
                    <span style={{ color: '#94a3b8', padding: '20px' }}>No ID Image Uploaded</span>
                  )}
                </div>
              </div>
            </div>

            <div className="modal-footer" style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', padding: '16px 24px', borderTop: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
              <button 
                className="btn-action reject" 
                onClick={() => handleUpdateStatus(selectedDoc.requestId, 'REJECTED')}
              >
                Reject Request
              </button>
              
              <button 
                className="btn-action" 
                style={{ backgroundColor: '#2563eb', color: 'white', padding: '8px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
                onClick={() => handleProcessAndPrint(selectedDoc.requestId)}
              >
                Process & Print Document
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