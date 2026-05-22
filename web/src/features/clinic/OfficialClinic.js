import React, { useState, useEffect } from 'react';
import Sidebar from '../../shared/components/Sidebar';
import '../../shared/components/Layout.css'; 
import './Clinic.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../shared/context/AuthContext';
import Toast from '../../shared/components/Toast';
import { StaffIcon } from '../../shared/components/Icons';
import { API_BASE_URL } from '../../shared/utils/config';

const OfficialClinic = () => {
  const navigate = useNavigate();
  const { user, token } = useAuth(); 
  const [toast, setToast] = useState({ message: '', type: '' });
  const displayName = user?.fullname || "Official User";
  const [staffList, setStaffList] = useState([]);
  const [isLoadingStaff, setIsLoadingStaff] = useState(true);
  const [services, setServices] = useState([]);
  const [newService, setNewService] = useState('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const fetchHealthStaff = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/officials/directory`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
          const directory = await response.json();
          const medicalKeywords = ['physician', 'nurse', 'pediatrician', 'health', 'doctor'];
          const filteredStaff = directory.filter(official => 
            medicalKeywords.some(keyword => 
              official.positionTitle?.toLowerCase().includes(keyword)
            )
          );
          
          const formattedStaff = filteredStaff.map(staff => ({
            id: staff.userId,
            name: staff.fullName,
            title: staff.positionTitle,
            isPresent: staff.present !== undefined ? staff.present : staff.isPresent
          }));
          
          setStaffList(formattedStaff);
        }
      } catch (error) {
        console.error("Network error:", error);
      } finally {
        setIsLoadingStaff(false);
      }
    };

    const fetchServices = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/clinic-services`, {
           headers: { 'Authorization': `Bearer ${token}` } 
        });
        if (response.ok) {
          const data = await response.json();
          setServices(data);
        }
      } catch (error) {
        console.error("Failed to fetch services:", error);
      }
    };

    if (token) {
      fetchHealthStaff();
      fetchServices(); 
    }
  }, [token, refreshTrigger]);

  const handleToggleStaff = async (id, currentStatus) => {
    const newStatus = !currentStatus; 
    setStaffList(staffList.map(staff => 
      staff.id === id ? { ...staff, isPresent: newStatus } : staff
    ));

    try {
      const response = await fetch(`${API_BASE_URL}/api/officials/${id}/presence?isPresent=${newStatus}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        setToast({ message: 'Staff availability saved.', type: 'success' });
        setRefreshTrigger(prev => prev + 1);
      } else {
        setStaffList(staffList.map(staff => 
          staff.id === id ? { ...staff, isPresent: currentStatus } : staff
        ));
        setToast({ message: 'Failed to save availability.', type: 'error' });
      }
    } catch (error) {
      console.error("Error updating presence:", error);
      setToast({ message: 'Network error occurred.', type: 'error' });
    }
  };

  const handleToggleService = async (id, currentStatus) => {
    const newStatus = !currentStatus; 
    setServices(services.map(svc => 
      svc.id === id ? { ...svc, available: newStatus, isAvailable: newStatus } : svc
    ));

    try {
      const response = await fetch(`${API_BASE_URL}/api/clinic-services/${id}/toggle?isAvailable=${newStatus}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        setToast({ message: 'Service status updated.', type: 'success' });
        setRefreshTrigger(prev => prev + 1);
      } else {
        throw new Error("Failed to toggle");
      }
    } catch (error) {
      setServices(services.map(svc => 
        svc.id === id ? { ...svc, available: currentStatus, isAvailable: currentStatus } : svc
      ));
      setToast({ message: 'Failed to update service.', type: 'error' });
    }
  };

  const handleAddService = async (e) => {
    e.preventDefault();
    if (!newService.trim()) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/clinic-services`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ serviceName: newService, isAvailable: true })
      });

      if (response.ok) {
        setNewService('');
        setToast({ message: 'New service added successfully.', type: 'success' });
        setRefreshTrigger(prev => prev + 1);
      } else {
        setToast({ message: 'Failed to add service.', type: 'error' });
      }
    } catch (error) {
      console.error("Error adding service:", error);
      setToast({ message: 'Network error occurred.', type: 'error' });
    }
  };  

  const handleDeleteService = async (id) => {
    const originalServices = [...services];
    setServices(services.filter(svc => svc.id !== id));

    try {
      const response = await fetch(`${API_BASE_URL}/api/clinic-services/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        setToast({ message: 'Service deleted permanently.', type: 'success' });
        setRefreshTrigger(prev => prev + 1);
      } else {
        throw new Error("Failed to delete");
      }
    } catch (error) {
      setServices(originalServices);
      setToast({ message: 'Failed to delete service.', type: 'error' });
    }
  };

  return (
    <div className="dashboard-wrapper">
      <Sidebar />
      <main className="main-content">
        <header className="dashboard-header">
          <div className="header-title">
            <h2>Clinic Management</h2>
          </div>
          
          <div className="profile-section">
            <div className="profile-details" onClick={() => navigate('/profile')} style={{ cursor: 'pointer' }}>
              <span className="profile-name">{displayName}</span>
              <span className="profile-role">Official</span>
            </div>
          </div>
        </header>

        <section className="dashboard-body">
          <div className="admin-controls-grid">
            
            <div className="dashboard-card admin-card">
              <h3 className="card-title">Manage Staff Presence</h3>
              <p className="card-subtitle">Toggle who is visible to residents today.</p>
              
              <div className="staff-toggle-list">
                {isLoadingStaff ? (
                  <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Loading medical staff...</p>
                ) : staffList.length > 0 ? (
                  staffList.map(staff => (
                    <div className="staff-toggle-item" key={staff.id}>
                      <div className="staff-toggle-info">
                        <div className="staff-icon-sm"><StaffIcon /></div>
                        <div>
                          <div className="staff-name-sm">{staff.name}</div>
                          <div className="staff-title-sm">{staff.title}</div>
                        </div>
                      </div>
                      <label className="switch">
                        <input 
                          type="checkbox" 
                          checked={staff.isPresent} 
                          onChange={() => handleToggleStaff(staff.id, staff.isPresent)} 
                        />
                        <span className="slider round"></span>
                      </label>
                    </div>
                  ))
                ) : (
                  <p style={{ fontSize: '0.85rem', color: '#64748b' }}>No medical staff found in directory.</p>
                )}
              </div>
            </div>

            <div className="dashboard-card admin-card">
              <h3 className="card-title">Daily Services</h3>
              <p className="card-subtitle">Toggle or add services available today.</p>
              
              <form className="service-post-form" onSubmit={handleAddService}>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="e.g., Free Dental Checkup"
                  value={newService}
                  onChange={(e) => setNewService(e.target.value)}
                />
                <button type="submit" className="btn-submit btn-sm">Post</button>
              </form>

              <div className="staff-toggle-list" style={{ marginTop: '15px' }}>
                {services.map((svc) => {
                  const currentStatus = svc.available !== undefined ? svc.available : svc.isAvailable;
                  return (
                    <div className="staff-toggle-item" key={svc.id}>
                      <div className="staff-toggle-info">
                        <span className={`service-badge ${currentStatus ? 'active' : 'inactive'}`} style={{ margin: 0, opacity: currentStatus ? 1 : 0.5 }}>
                          {svc.serviceName}
                        </span>
                      </div>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <label className="switch">
                          <input 
                            type="checkbox" 
                            checked={currentStatus} 
                            onChange={() => handleToggleService(svc.id, currentStatus)} 
                          />
                          <span className="slider round"></span>
                        </label>

                        <button 
                          type="button" 
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to delete "${svc.serviceName}"?`)) {
                              handleDeleteService(svc.id);
                            }
                          }}
                          className="delete"
                          title="Delete service permanently"
                        >
                          &times;
                        </button>
                      </div>
                    </div>
                  );
                })}
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

export default OfficialClinic;