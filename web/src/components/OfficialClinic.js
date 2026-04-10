import React, { useState, useEffect } from 'react';
import Sidebar from './reusable/Sidebar';
import './reusable/Dashboard.css'; 
import './reusable/OfficialClinic.css'; 
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import Toast from './reusable/Toast';
import { StaffIcon } from './reusable/Icons';

const OfficialClinic = () => {
  const navigate = useNavigate();
  const { user, token, logout } = useAuth(); 
  const [toast, setToast] = useState({ message: '', type: '' });
  const displayName = user?.fullname || "Official User";
  const [staffList, setStaffList] = useState([]);
  const [isLoadingStaff, setIsLoadingStaff] = useState(true);
  const [services, setServices] = useState([
    'General Consultation',
    'Blood Pressure Monitoring'
  ]);
  const [newService, setNewService] = useState('');

  const [patients] = useState([
    { id: 'APT-A1B2', name: 'Juan Dela Cruz', service: 'General Consultation', time: '08:00 AM' },
    { id: 'APT-C3D4', name: 'Maria Clara', service: 'Maternal Health Check-up', time: '09:00 AM' }
  ]);

  const [pendingAppointments] = useState([
    { id: 'APT-E5F6', name: 'Pedro Penduko', service: 'First Aid', time: '01:00 PM', date: '2026-04-12' },
    { id: 'APT-G7H8', name: 'Andres Bonifacio', service: 'Vaccination', time: '02:30 PM', date: '2026-04-12' }
  ]);

  useEffect(() => {
    const fetchHealthStaff = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/officials/directory', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
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
            isPresent: true 
          }));
          
          setStaffList(formattedStaff);
        } else {
          console.error("Failed to fetch directory");
        }
      } catch (error) {
        console.error("Network error:", error);
      } finally {
        setIsLoadingStaff(false);
      }
    };

    if (token) {
      fetchHealthStaff();
    }
  }, [token]);

  const handleLogoutClick = () => {
    setToast({ message: 'Logging out successfully...', type: 'info' });
    setTimeout(() => {
      logout();
      navigate('/login');
    }, 1500);
  };

  const handleToggleStaff = (id) => {
    setStaffList(staffList.map(staff => 
      staff.id === id ? { ...staff, isPresent: !staff.isPresent } : staff
    ));
    setToast({ message: 'Staff availability updated.', type: 'info' });
  };

  const handleAddService = (e) => {
    e.preventDefault();
    if (!newService.trim()) return;
    setServices([...services, newService]);
    setNewService('');
    setToast({ message: 'Service posted successfully.', type: 'success' });
  };

  const handleRemoveService = (indexToRemove) => {
    setServices(services.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="dashboard-wrapper">
      <Sidebar onLogout={handleLogoutClick} />
      
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
          
          {/* TOP ROW: Admin Controls */}
          <div className="admin-controls-grid">
            
            {/* Control 1: Staff Availability Toggles */}
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
                          onChange={() => handleToggleStaff(staff.id)} 
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

            {/* Control 2: Post Daily Services */}
            <div className="dashboard-card admin-card">
              <h3 className="card-title">Post Daily Services</h3>
              <p className="card-subtitle">Add services available at the clinic today.</p>
              
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

              <ul className="posted-services-list">
                {services.map((svc, index) => (
                  <li key={index}>
                    <span>{svc}</span>
                    <button className="btn-remove-sm" onClick={() => handleRemoveService(index)}>&times;</button>
                  </li>
                ))}
                {services.length === 0 && <li className="empty-text">No services posted today.</li>}
              </ul>
            </div>
          </div>

          {/* BOTTOM ROW: The Wireframe Boxes */}
          <div className="dashboard-card">
            <h3 className="card-title">Today's Patients</h3>
            <div className="table-responsive">
              <table className="official-table">
                <thead>
                  <tr>
                    <th>Ref Number</th>
                    <th>Patient Name</th>
                    <th>Service Requested</th>
                    <th>Time Slot</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.map((pt, index) => (
                    <tr key={index}>
                      <td><span className="ref-badge">{pt.id}</span></td>
                      <td className="fw-600">{pt.name}</td>
                      <td>{pt.service}</td>
                      <td>{pt.time}</td>
                      <td>
                        <button className="btn-action complete">Mark Attended</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="dashboard-card">
            <h3 className="card-title">Pending Appointments</h3>
            <div className="table-responsive">
              <table className="official-table">
                <thead>
                  <tr>
                    <th>Ref Number</th>
                    <th>Patient Name</th>
                    <th>Date & Time</th>
                    <th>Service Requested</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingAppointments.map((apt, index) => (
                    <tr key={index}>
                      <td><span className="ref-badge">{apt.id}</span></td>
                      <td className="fw-600">{apt.name}</td>
                      <td>{apt.date} at {apt.time}</td>
                      <td>{apt.service}</td>
                      <td className="action-cell">
                        <button className="btn-action approve">Approve</button>
                        <button className="btn-action reject">Reject</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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