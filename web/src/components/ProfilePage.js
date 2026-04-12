import React, { useState, useEffect } from 'react';
import Sidebar from './reusable/Sidebar';
import './reusable/Dashboard.css';
import './reusable/Profile.css';
import { useAuth } from './AuthContext';
const DEFAULT_AVATAR = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

const Profile = () => {
  // Assuming your AuthContext provides the role (e.g., user.role = 'Resident' or 'Official')
  const { user, token } = useAuth(); 
  const [isEditing, setIsEditing] = useState(false);
  
  // 1. Added all SDD fields for both Residents and Officials
  const [formData, setFormData] = useState({
    userId: user?.userId || '', 
    userFirstname: '',
    userLastname: '',
    userMiddlename: '',
    userEmail: '', 
    userBirthdate: '',
    profileImage: '',
    age: 0,
    address: '',
    contactNumber: '',
    civilStatus: '',
    voterStatus: '',
    occupation: '',
    // Official Specific
    positionTitle: '',
    termStart: '',
    termEnd: ''
  });
  
  const [tempData, setTempData] = useState({ ...formData });

  useEffect(() => {
    const initializeProfile = async () => {
      if (user?.isGuest) {
        const guestData = {
          ...formData, // Spread existing empty strings
          userId: 0,
          userFirstname: 'Guest',
          userLastname: 'User',
          userEmail: 'guest@example.com',
          userBirthdate: '2000-01-01',
          age: 26,
          role: 'Guest'
        };
        setFormData(guestData);
        setTempData(guestData);
        return; 
      }

      if (user && !user.isGuest && token) {
        try {
          const response = await fetch(`http://localhost:8080/api/users/profile/${user.userId}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (response.ok) {
            const data = await response.json();
            
            const mappedData = {
              userId: user.userId,
              userFirstname: data.userFirstname || '',
              userLastname: data.userLastname || '',
              userMiddlename: data.userMiddlename || '',
              userEmail: data.userEmail || user.email, 
              userBirthdate: data.userBirthdate || '',
              profileImage: data.profileImage || '',
              age: data.age || 0,
              address: data.address || '',
              contactNumber: data.contactNumber || '',
              civilStatus: data.civilStatus || '',
              voterStatus: data.voterStatus || '',
              occupation: data.occupation || '',
              positionTitle: data.positionTitle || '',
              termStart: data.termStart || '',
              termEnd: data.termEnd || ''
            };
            
            setFormData(mappedData);
            setTempData(mappedData);
          }
        } catch (error) {
          console.error("Failed to fetch profile:", error);
        }
      }
    };

    initializeProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, token]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File is too large! Please choose an image under 5MB.");
        return; 
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempData(prev => ({ ...prev, profileImage: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    setTempData({ ...tempData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (tempData.userBirthdate) {
      const today = new Date();
      const bday = new Date(tempData.userBirthdate);
      
      let calcAge = today.getFullYear() - bday.getFullYear();
      const monthDiff = today.getMonth() - bday.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < bday.getDate())) {
        calcAge--;
      }
      setTempData(prev => ({ ...prev, age: calcAge >= 0 ? calcAge : 0 }));
    }
  }, [tempData.userBirthdate]); 

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
            alert("Profile updated!");
        } else {
            alert("Update failed");
        }
    } catch (error) {
        console.error("Error updating:", error);
    }
  };

  const handleCancel = () => {
    setTempData({ ...formData });
    setIsEditing(false);
  };

  return (
    <div className="dashboard-wrapper">
      <Sidebar />
      <main className="main-content">
        <header className="dashboard-header">
          <h2>{user?.role === 'Official' ? 'Official Profile' : 'Resident Profile'}</h2>
        </header>

        <section className="dashboard-body">
          <div className="profile-card">
            
            <div className="profile-header">
              <div className="avatar-container">
                <img 
                  src={tempData.profileImage || DEFAULT_AVATAR} 
                  alt="Profile" 
                  className="profile-avatar"
                />
                {isEditing && (
                  <div className="avatar-overlay">
                    <label htmlFor="avatar-upload" className="avatar-upload-btn">
                      Change
                    </label>
                    <input 
                      id="avatar-upload" 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageChange} 
                      style={{ display: 'none' }} 
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="profile-form">
              {/* --- 1. CORE IDENTITY (All Users) --- */}
              <h4 className="form-section-title">Personal Information</h4>
              <div className="form-row split">
                <div className="input-group">
                  <label>First Name</label>
                  <input name="userFirstname" disabled={!isEditing} value={tempData.userFirstname} onChange={handleChange} className={!isEditing ? "read-only-view" : ""} />
                </div>
                <div className="input-group">
                  <label>Middle Name</label>
                  <input name="userMiddlename" disabled={!isEditing} value={tempData.userMiddlename} onChange={handleChange} className={!isEditing ? "read-only-view" : ""} />
                </div>
                <div className="input-group">
                  <label>Last Name</label>
                  <input name="userLastname" disabled={!isEditing} value={tempData.userLastname} onChange={handleChange} className={!isEditing ? "read-only-view" : ""} />
                </div>
              </div>

              <div className="form-row split">
                <div className="input-group">
                  <label>Email Address</label>
                  <input name="userEmail" disabled={true} value={tempData.userEmail} className="read-only-view" />
                </div>
                <div className="input-group">
                  <label>Contact Number</label>
                  <input name="contactNumber" disabled={!isEditing} value={tempData.contactNumber} onChange={handleChange} className={!isEditing ? "read-only-view" : ""} placeholder="e.g., 09123456789" />
                </div>
              </div>

              <div className="form-row split">
                <div className="input-group">
                  <label>Birthdate</label>
                  <input type="date" name="userBirthdate" disabled={!isEditing} value={tempData.userBirthdate} onChange={handleChange} className={!isEditing ? "read-only-view" : ""} />
                </div>
                <div className="input-group">
                  <label>Age</label>
                  <input value={tempData.age} readOnly className="read-only-view" />
                </div>
              </div>

              {/* --- 2. DEMOGRAPHICS (All Users) --- */}
              <h4 className="form-section-title" style={{ marginTop: '24px' }}>Demographics & Status</h4>
              <div className="form-row">
                <div className="input-group">
                  <label>Full Address</label>
                  <input name="address" disabled={!isEditing} value={tempData.address} onChange={handleChange} className={!isEditing ? "read-only-view" : ""} />
                </div>
              </div>

              <div className="form-row split">
                <div className="input-group">
                  <label>Civil Status</label>
                  <select name="civilStatus" disabled={!isEditing} value={tempData.civilStatus} onChange={handleChange} className={!isEditing ? "read-only-view" : ""}>
                    <option value="">Select Status</option>
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Widowed">Widowed</option>
                  </select>
                </div>
                <div className="input-group">
                  <label>Occupation</label>
                  <input name="occupation" disabled={!isEditing} value={tempData.occupation} onChange={handleChange} className={!isEditing ? "read-only-view" : ""} />
                </div>
                <div className="input-group">
                  <label>Voter Status</label>
                  <select name="voterStatus" disabled={!isEditing} value={tempData.voterStatus} onChange={handleChange} className={!isEditing ? "read-only-view" : ""}>
                    <option value="">Select Status</option>
                    <option value="Registered">Registered Voter</option>
                    <option value="Unregistered">Not Registered</option>
                  </select>
                </div>
              </div>

              {/* --- 3. OFFICIAL ONLY FIELDS --- */}
              {user?.role === 'Official' && (
                <>
                  <h4 className="form-section-title" style={{ marginTop: '24px', color: '#0284c7' }}>Official Appointment Details</h4>
                  <div className="form-row">
                    <div className="input-group">
                      <label>Position / Title</label>
                      <input name="positionTitle" disabled={true} value={tempData.positionTitle} className="read-only-view" title="Contact System Admin to change position" />
                    </div>
                  </div>
                  <div className="form-row split">
                    <div className="input-group">
                      <label>Term Start Date</label>
                      <input type="date" name="termStart" disabled={true} value={tempData.termStart} className="read-only-view" />
                    </div>
                    <div className="input-group">
                      <label>Term End Date</label>
                      <input type="date" name="termEnd" disabled={true} value={tempData.termEnd} className="read-only-view" />
                    </div>
                  </div>
                </>
              )}

              {/* --- ACTIONS --- */}
              <div className="profile-actions" style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #e2e8f0' }}>
                {!isEditing ? (
                  <div>
                    {user?.isGuest ? (
                      <div className="alert-guest">Guests cannot edit profiles.</div>
                    ) : (
                      <button className="btn-edit" onClick={() => setIsEditing(true)}>
                        Edit Profile
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="edit-controls">
                    <button className="btn-save" onClick={handleSave}>Save Changes</button>
                    <button className="btn-cancel" onClick={handleCancel}>Cancel</button>
                  </div>
                )}
              </div>
              
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Profile;