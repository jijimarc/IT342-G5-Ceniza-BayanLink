import React, { useState, useEffect } from 'react';
import Sidebar from './reusable/Sidebar';
import './reusable/Dashboard.css'; 
import './reusable/Documents.css'; 
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import Toast from './reusable/Toast';
import { DocumentIcon } from './reusable/Icons'; 

const DocumentsPage = () => {
  const navigate = useNavigate();
  const { user, token, logout } = useAuth();
  const [toast, setToast] = useState({ message: '', type: '' });
  const [idImage, setIdImage] = useState(null);
  const [pendingDocuments, setPendingDocuments] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const displayName = user?.isGuest ? "Guest User" : (user?.fullname || user?.email || "User");

  const getEstimatedFee = (urgency) => {
    switch (urgency) {
      case 'Rush': return 150;
      case 'Emergency': return 175;
      case 'Standard':
      default: return 100;
    }
  };

  const [formData, setFormData] = useState({
    fullName: user?.fullname || '',
    documentType: '',
    validId: '',
    purpose: '',
    urgencyLevel: 'Standard'
  });
  
  

  useEffect(() => {
    const fetchDocuments = async () => {
      if (!user || user.isGuest || !token) return;

      try {
        const response = await fetch(`http://localhost:8080/api/documents/user/${user.userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setPendingDocuments(data);
        }
      } catch (error) {
        console.error("Failed to fetch documents:", error);
      }
    };

    fetchDocuments();
  }, [user, token]);

  const handleLogoutClick = () => {
    setToast({ message: 'Logging out successfully...', type: 'info' });
    setTimeout(() => {
      logout();
      navigate('/login');
    }, 1500);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setToast({ message: 'File is too large! Please choose an image under 5MB.', type: 'error' });
        e.target.value = ''; 
        return;
      }
      setIdImage(file);
    }
  };

  const handleClear = () => {
    setFormData({
      fullName: user?.fullname || '',
      documentType: '',
      validId: '',
      purpose: ''
    });
    setIdImage(null); 
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) fileInput.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.documentType || !formData.purpose || !idImage) {
      setToast({ message: 'Please fill in all required fields and upload an ID.', type: 'error' });
      return;
    }

    const submissionData = new FormData();
    submissionData.append('userId', user.userId);
    submissionData.append('fullName', formData.fullName);
    submissionData.append('documentType', formData.documentType);
    submissionData.append('validId', formData.validId);
    submissionData.append('purpose', formData.purpose);
    submissionData.append('urgencyLevel', formData.urgencyLevel);
    submissionData.append('idImage', idImage); 

    try {
      const response = await fetch('http://localhost:8080/api/documents/request', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: submissionData
      });

      if (response.ok) {
        const newDoc = await response.json();
        setToast({ message: 'Document request submitted successfully!', type: 'success' });
        
        setPendingDocuments(prev => [...prev, newDoc]);
        
        handleClear();
      } else {
        const errorMessage = await response.text(); 
        console.error("Backend Error Details:", errorMessage);
        setToast({ message: `Error: ${errorMessage}`, type: 'error' });
      }
    } catch (error) {
      console.error("Submission error:", error);
      setToast({ message: 'Network error occurred.', type: 'error' });
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
              <span className="profile-name">{displayName}</span>
              <span className="profile-role">{user?.isGuest ? 'Guest' : (user?.role || 'User')}</span>
            </div>
          </div>
        </header>

        <section className="dashboard-body">
          
          <div className="dashboard-card">
            <h3 className="card-title">New Request</h3>
            <form className="request-form" onSubmit={handleSubmit}>
              
              <div className="form-columns">
                {/* Left Column: Inputs */}
                <div className="form-col-left">
                  <div className="form-group">
                    <label>Full Name</label>
                    <input 
                      type="text" 
                      name="fullName"
                      className="form-control"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Document Type</label>
                    <select 
                      name="documentType" 
                      className="form-control"
                      value={formData.documentType}
                      onChange={handleChange}
                      required
                    >
                      <option value="" disabled>Select Document</option>
                      <option value="Barangay Clearance">Barangay Clearance</option>
                      <option value="Certificate of Indigency">Certificate of Indigency</option>
                      <option value="Business Permit">Business Permit</option>
                      <option value="Health Certificate">Health Certificate</option>
                      <option value="Certificate of Good Moral Character">Certificate of Good Moral Character</option>
                      <option value="Certificate of Residency">Certificate of Residency</option>
                      <option value="Community Tax Certificate">Community Tax Certificate</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Valid ID Requirement</label>
                    <select 
                      name="validId" 
                      className="form-control"
                      value={formData.validId}
                      onChange={handleChange}
                      required
                    >
                      <option value="" disabled>Select ID Type</option>
                      <option value="National ID">National ID</option>
                      <option value="Driver's License">Driver's License</option>
                      <option value="Passport">Passport</option>
                      <option value="Voter's ID">Voter's ID</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Upload ID Image</label>
                    <input 
                      type="file" 
                      name="idImage"
                      accept="image/png, image/jpeg, image/jpg"
                      className="form-control"
                      onChange={handleImageChange}
                      required
                      style={{ padding: '7px 12px' }} 
                    />
                    {idImage && <small style={{ color: '#3b82f6', marginTop: '4px' }}>✓ {idImage.name} attached</small>}
                  </div>
                </div>

                <div className="form-group">
                  <label>Urgency Level</label>
                  <select 
                    name="urgencyLevel" 
                    className="form-control"
                    value={formData.urgencyLevel}
                    onChange={handleChange}
                    required
                  >
                    <option value="Standard">Standard (3-5 Working Days)</option>
                    <option value="Rush">Rush (1-2 Working Days)</option>
                    <option value="Emergency">Emergency (Same Day)</option>
                  </select>
                </div>
                

                {/* Right Column: Textarea */}
                <div className="form-col-right">
                  <div className="form-group h-100">
                    <label>Purpose</label>
                    <textarea 
                      name="purpose"
                      className="form-control textarea-control"
                      value={formData.purpose}
                      onChange={handleChange}
                      placeholder="State the purpose of your request..."
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="form-actions">
                <button type="button" className="btn-remove" onClick={handleClear}>Remove</button>
                <button type="submit" className="btn-submit">Submit</button>
              </div>

            </form>
          </div>

          {/* Dynamic Documents Grid */}
          <div className="dashboard-card">
            <h3 className="card-title">Pending Documents</h3>
            <div className="documents-grid">
              
              {/* Loop through the fetched documents */}
              {pendingDocuments.length > 0 ? (
                pendingDocuments.map((doc, index) => (
                  <div className="document-item" key={index} onClick={() => setSelectedDoc(doc)} style={{ cursor: 'pointer' }}>
                    <div className="document-icon-wrapper">
                      <DocumentIcon />
                    </div>
                    <span className="document-label">{doc.documentType}</span>
                  </div>
                ))
              ) : (
                <p style={{ color: '#64748b', fontSize: '0.9rem' }}>No pending documents found.</p>
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
      {selectedDoc && (
        <div className="modal-overlay" onClick={() => setSelectedDoc(null)}>
          {/* Prevent clicks inside the modal from closing it */}
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Document Details</h3>
              <button className="close-btn" onClick={() => setSelectedDoc(null)}>&times;</button>
            </div>
            <div className="modal-body">
              <p><strong>Name:</strong> {displayName}</p>
              <p><strong>Document:</strong> {selectedDoc.documentType}</p>
              <p><strong>Urgency:</strong> {selectedDoc.urgencyLevel || 'Standard'}</p>
              <p><strong>Status:</strong> <span className="status-badge">{selectedDoc.status || 'Pending'}</span></p>
              
              <div className="fee-container">
                <p className="fee-label">Estimated Fee</p>
                <h2 className="fee-amount">₱{getEstimatedFee(selectedDoc.urgencyLevel)}</h2>
                <small className="fee-notice">*Please prepare this exact amount for your face-to-face retrieval at the Barangay Hall.</small>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    
  );
};

export default DocumentsPage;