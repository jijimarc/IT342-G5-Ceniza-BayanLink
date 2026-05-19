import React, { useState, useEffect } from 'react';
import Sidebar from '../../shared/components/Sidebar';
import { useAuth } from '../../shared/context/AuthContext';
import Toast from '../../shared/components/Toast'; 
import '../../shared/components/Layout.css';
import '../profile/Profile.css';

const DEFAULT_AVATAR = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

const AdminProfile = () => {
  const { user, token, updateUser } = useAuth(); 
  const [toast, setToast] = useState({ message: '', type: '' }); 
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    userId: user?.userId || '', 
    userFirstname: '',
    userLastname: '',
    userEmail: '', 
    contactNumber: '',
    userProfileImage: ''
  });
  
  const [tempData, setTempData] = useState({ ...formData });

  useEffect(() => {
    if (user && token) {
      fetch(`http://localhost:8080/api/users/profile/${user.userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        const mappedData = {
          userId: user.userId,
          userFirstname: data.userFirstname || '',
          userLastname: data.userLastname || '',
          userEmail: data.userEmail || user.email, 
          contactNumber: data.contactNumber || '',
          userProfileImage: data.userProfileImage || ''
        };
        setFormData(mappedData);
        setTempData(mappedData);
      })
      .catch(err => console.error("Failed to fetch profile:", err));
    }
  }, [user, token]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempData(prev => ({ ...prev, userProfileImage: reader.result })); 
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
        const response = await fetch('http://localhost:8080/api/users/profile', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(tempData)
        });

        if (response.ok) {
            setFormData({ ...tempData });
            setIsEditing(false);
            setToast({ message: "Admin credentials updated!", type: "success" });
            
            const updatedFullName = `${tempData.userFirstname} ${tempData.userLastname}`.trim();
            updateUser({
              ...user,
              fullname: updatedFullName !== '' ? updatedFullName : user.email
            });
        }
    } catch (error) {
        setToast({ message: "Network error occurred.", type: "error" });
    }
  };

  return (
    <div className="dashboard-wrapper">
      <Sidebar />
      <main className="main-content">
        <header className="dashboard-header">
          <h2>Administrator Settings</h2>
        </header>

        <section className="dashboard-body">
          <div className="profile-card" style={{ maxWidth: '800px' }}>
            
            <div className="profile-header">
              <div className="avatar-container">
                <img 
                  src={tempData.userProfileImage || DEFAULT_AVATAR}
                  alt="Admin Profile" 
                  className="profile-avatar"
                />
                {isEditing && (
                  <div className="avatar-overlay">
                    <label htmlFor="avatar-upload" className="avatar-upload-btn">Change</label>
                    <input id="avatar-upload" type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
                  </div>
                )}
              </div>
            </div>

            <div className="profile-form">
              <h4 className="form-section-title">System Credentials</h4>
              
              <div className="form-row split">
                <div className="input-group">
                  <label>First Name</label>
                  <input name="userFirstname" disabled={!isEditing} value={tempData.userFirstname} onChange={(e) => setTempData({...tempData, userFirstname: e.target.value})} className={!isEditing ? "read-only-view" : ""} />
                </div>
                <div className="input-group">
                  <label>Last Name</label>
                  <input name="userLastname" disabled={!isEditing} value={tempData.userLastname} onChange={(e) => setTempData({...tempData, userLastname: e.target.value})} className={!isEditing ? "read-only-view" : ""} />
                </div>
              </div>

              <div className="form-row split">
                <div className="input-group">
                  <label>Email Address</label>
                  <input name="userEmail" disabled={true} value={tempData.userEmail} className="read-only-view" title="Email cannot be changed" />
                </div>
                <div className="input-group">
                  <label>Emergency Contact Number</label>
                  <input name="contactNumber" disabled={!isEditing} value={tempData.contactNumber} onChange={(e) => setTempData({...tempData, contactNumber: e.target.value})} className={!isEditing ? "read-only-view" : ""} placeholder="e.g., 09123456789" />
                </div>
              </div>

              <div className="profile-actions" style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #e2e8f0' }}>
                {!isEditing ? (
                  <button className="btn-edit" onClick={() => setIsEditing(true)}>Edit Credentials</button>
                ) : (
                  <div className="edit-controls">
                    <button className="btn-save" onClick={handleSave}>Save Changes</button>
                    <button className="btn-cancel" onClick={() => { setTempData({...formData}); setIsEditing(false); }}>Cancel</button>
                  </div>
                )}
              </div>
              
            </div>
          </div>
        </section>
      </main>
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: '' })} />
    </div>
  );
};

export default AdminProfile;