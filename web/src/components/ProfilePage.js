import React, { useState, useEffect } from 'react';
import Sidebar from './reusable/Sidebar';
import './reusable/Dashboard.css';
import './reusable/Profile.css';
import { useAuth } from './AuthContext';
const DEFAULT_AVATAR = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

const Profile = () => {
  const { user, token } = useAuth(); 
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    userId: user?.userId || '', 
    userFirstname: '',
    userLastname: '',
    userMiddlename: '',
    userEmail: '', 
    userBirthdate: '',
    profileImage: '',
    age: 0
  });
  const [tempData, setTempData] = useState({ ...formData });

  useEffect(() => {
    const initializeProfile = async () => {
      if (user?.isGuest) {
        const guestData = {
          userId: 0,
          userFirstname: 'Guest',
          userLastname: 'User',
          userMiddlename: '',
          userEmail: 'guest@example.com',
          userBirthdate: '2000-01-01',
          age: 26
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
              age: data.age || 0 
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
          <h2>User Profile</h2>
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
              <div className="form-row split">
                <div className="input-group">
                  <label>First Name</label>
                  <input 
                    name="userFirstname"
                    disabled={!isEditing}
                    value={tempData.userFirstname}
                    onChange={handleChange}
                    className={!isEditing ? "read-only-view" : ""}
                  />
                </div>
                <div className="input-group">
                  <label>Middle Name</label>
                  <input 
                    name="userMiddlename"
                    disabled={!isEditing}
                    value={tempData.userMiddlename}
                    onChange={handleChange}
                    className={!isEditing ? "read-only-view" : ""}
                  />
                </div>
                <div className="input-group">
                  <label>Last Name</label>
                  <input 
                    name="userLastname"
                    disabled={!isEditing}
                    value={tempData.userLastname}
                    onChange={handleChange}
                    className={!isEditing ? "read-only-view" : ""}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="input-group">
                  <label>Email Address</label>
                  <input 
                    name="userEmail"
                    disabled={true} 
                    value={tempData.userEmail}
                    className="read-only-view"
                  />
                </div>
              </div>

              <div className="form-row split">
                <div className="input-group">
                  <label>Birthdate</label>
                  <input 
                    type="date"
                    name="userBirthdate"
                    disabled={!isEditing}
                    value={tempData.userBirthdate}
                    onChange={handleChange}
                    className={!isEditing ? "read-only-view" : ""}
                  />
                </div>
                <div className="input-group">
                  <label>Age</label>
                  <input value={tempData.age} readOnly className="read-only-view" />
                </div>
              </div>

              <div className="profile-actions">
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