import React, { useState, useEffect } from 'react';
import Sidebar from '../../shared/components/Sidebar';
import Toast from '../../shared/components/Toast';
import { useAuth } from '../../shared/context/AuthContext';
import '../../shared/components/Layout.css';
import './UserManagement.css';
import { API_BASE_URL } from '../../shared/utils/config';

const UserManagement = () => {
  const { user, token } = useAuth();
  const [toast, setToast] = useState({ message: '', type: '' });
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('RESIDENT'); 
  const [loading, setLoading] = useState(false);
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    userFirstName: '',
    userLastName: '',
    userEmail: '',
    userPassword: '',
    confirmPassword: '',
    role: 'OFFICIAL'
  });

  useEffect(() => {
    fetchUsers(activeTab);
  }, [activeTab]);

  const fetchUsers = async (role) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/users?role=${role}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
          const data = await response.json();
          const sortedData = data.sort((a, b) => a.userId - b.userId);
          setUsers(sortedData);
      }else {
        setToast({ message: "Failed to load users", type: "error" });
      }
    } catch (error) {
      setToast({ message: "Network error", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId, name) => {
    if (!window.confirm(`Are you sure you want to permanently delete ${name}'s account?`)) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        setToast({ message: "Account deleted successfully", type: "success" });
        setUsers(users.filter(u => u.userId !== userId));
      } else {
        setToast({ message: "Failed to delete account", type: "error" });
      }
    } catch (error) {
      setToast({ message: "Network error", type: "error" });
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (formData.userPassword !== formData.confirmPassword) {
      return setToast({ message: "Passwords do not match", type: "error" });
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/users?role=${formData.role}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userFirstName: formData.userFirstName,
          userLastName: formData.userLastName,
          userEmail: formData.userEmail,
          userPassword: formData.userPassword,
          confirmPassword: formData.confirmPassword
        })
      });

      if (response.ok) {
        setToast({ message: `${formData.role} created successfully!`, type: "success" });
        setShowAddModal(false);
        setFormData({ ...formData, userFirstName: '', userLastName: '', userEmail: '', userPassword: '', confirmPassword: '' });
        if (activeTab === formData.role) fetchUsers(activeTab);
      } else {
        const errorData = await response.json();
        setToast({ message: errorData.message || "Failed to create account", type: "error" });
      }
    } catch (error) {
      setToast({ message: "Network error", type: "error" });
    }
  };

  return (
    <div className="dashboard-wrapper">
      <Sidebar />
      <main className="main-content">
        <header className="dashboard-header">
          <h2>User Management</h2>
          <p className="header-subtitle">View and manage system accounts</p>
        </header>

        <section className="dashboard-body">
          <div className="admin-controls-card">
            
            <div className="tabs-container">
              <button className={`tab-btn ${activeTab === 'RESIDENT' ? 'active' : ''}`} onClick={() => setActiveTab('RESIDENT')}>Residents</button>
              <button className={`tab-btn ${activeTab === 'OFFICIAL' ? 'active' : ''}`} onClick={() => setActiveTab('OFFICIAL')}>Staff & Officials</button>
              <button className={`tab-btn ${activeTab === 'ADMIN' ? 'active' : ''}`} onClick={() => setActiveTab('ADMIN')}>Administrators</button>
            </div>

            {activeTab !== 'RESIDENT' && (
              <div className="action-bar">
                <button className="btn-add-user" onClick={() => setShowAddModal(true)}>
                  + Add New {activeTab === 'OFFICIAL' ? 'Staff' : 'Admin'}
                </button>
              </div>
            )}

            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Full Name</th>
                    <th>Email Address</th>
                    <th>Role</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan="5" className="text-center">Loading data...</td></tr>
                  ) : users.length === 0 ? (
                    <tr><td colSpan="5" className="text-center">No users found for this role.</td></tr>
                  ) : (
                    users.map((u) => (
                      <tr key={u.userId}>
                        <td>#{u.userId}</td>
                        <td className="font-medium">{u.fullName}</td>
                        <td>{u.userEmail}</td>
                        <td><span className={`badge ${u.userRole.toLowerCase()}`}>{u.userRole}</span></td>
                        <td>
                          {u.userId !== user?.userId && (
                            <button className="btn-delete" onClick={() => handleDelete(u.userId, u.fullName)}>
                              Delete
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

          </div>
        </section>
      </main>

      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Add New Official / Admin</h3>
            <form onSubmit={handleAddSubmit}>
              <div className="form-row split">
                <div className="input-group">
                  <label>First Name</label>
                  <input required value={formData.userFirstName} onChange={(e) => setFormData({...formData, userFirstName: e.target.value})} />
                </div>
                <div className="input-group">
                  <label>Last Name</label>
                  <input required value={formData.userLastName} onChange={(e) => setFormData({...formData, userLastName: e.target.value})} />
                </div>
              </div>
              <div className="input-group">
                <label>Email Address</label>
                <input type="email" required placeholder="name@bayanlink.ph" value={formData.userEmail} onChange={(e) => setFormData({...formData, userEmail: e.target.value})} />
              </div>
              <div className="input-group">
                <label>Role</label>
                <select value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})}>
                  <option value="OFFICIAL">Official / Staff</option>
                  <option value="ADMIN">System Administrator</option>
                </select>
              </div>
              <div className="form-row split">
                <div className="input-group">
                  <label>Password</label>
                  <input type="password" required value={formData.userPassword} onChange={(e) => setFormData({...formData, userPassword: e.target.value})} />
                </div>
                <div className="input-group">
                  <label>Confirm Password</label>
                  <input type="password" required value={formData.confirmPassword} onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} />
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="btn-save">Create Account</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: '' })} />
    </div>
  );
};

export default UserManagement;