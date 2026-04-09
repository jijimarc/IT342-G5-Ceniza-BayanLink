import React, { useState } from 'react';
import Sidebar from './reusable/Sidebar';
import './reusable/Dashboard.css'; // Reuses main layout styling
import './reusable/Documents.css'; // Specific styling for this page
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import Toast from './reusable/Toast';
import { DocumentIcon } from './reusable/Icons'; 

const DocumentsPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [toast, setToast] = useState({ message: '', type: '' });
  const [idImage, setIdImage] = useState(null);
  const [formData, setFormData] = useState({
    fullName: user?.fullname || '',
    documentType: '',
    validId: '',
    purpose: ''
  });

  const displayName = user?.isGuest ? "Guest User" : (user?.fullname || user?.email || "User");

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
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.documentType || !formData.purpose) {
      setToast({ message: 'Please fill in all required fields.', type: 'error' });
      return;
    }
    // Mock submission
    setToast({ message: 'Document request submitted successfully!', type: 'success' });
    handleClear();
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
          
          {/* New Request Form Card */}
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

          {/* Existing/Available Documents Grid */}
          <div className="dashboard-card">
            <h3 className="card-title">Pending Documents</h3>
            <div className="documents-grid">
              
              <div className="document-item">
                <div className="document-icon-wrapper">
                  <DocumentIcon />
                </div>
                <span className="document-label">Barangay Clearance</span>
              </div>

              <div className="document-item">
                <div className="document-icon-wrapper">
                  <DocumentIcon />
                </div>
                <span className="document-label">Cert. of Indigency</span>
              </div>

              <div className="document-item">
                <div className="document-icon-wrapper">
                  <DocumentIcon />
                </div>
                <span className="document-label">Business Permit</span>
              </div>

              <div className="document-item">
                <div className="document-icon-wrapper">
                  <DocumentIcon />
                </div>
                <span className="document-label">Health Certificate</span>
              </div>

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

export default DocumentsPage;