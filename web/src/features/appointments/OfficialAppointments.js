import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from '../../shared/components/Sidebar';
import '../../shared/components/Layout.css'; 
import './Appointments.css'; 
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../shared/context/AuthContext';
import Toast from '../../shared/components/Toast';
import { StaffIcon } from '../../shared/components/Icons'; 
import { API_BASE_URL } from '../../shared/utils/config';

const OfficialAppointments = () => {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [toast, setToast] = useState({ message: '', type: '' });
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [clinicSchedule, setClinicSchedule] = useState([]);
  const [captainSchedule, setCaptainSchedule] = useState([]);
  const [adminStaffList, setAdminStaffList] = useState([]);
  const [isLoadingStaff, setIsLoadingStaff] = useState(true);

  const fetchSchedule = useCallback(async () => {
    if (!token) return;
    try {
      const response = await fetch(`${API_BASE_URL}/api/appointments/schedule?date=${selectedDate}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        
        const clinicApts = data.filter(apt => !apt.serviceType?.toLowerCase().includes('counseling'));
        const captainApts = data.filter(apt => apt.serviceType?.toLowerCase().includes('counseling'));

        setClinicSchedule(clinicApts);
        setCaptainSchedule(captainApts);
      }
    } catch (error) {
      console.error("Failed to fetch schedule:", error);
    }
  }, [token, selectedDate]);
  const fetchAdminStaff = useCallback(async () => {
    if (!token) return;
    try {
      const response = await fetch(`${API_BASE_URL}/api/officials/directory`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const directory = await response.json();
        
        const adminKeywords = ['captain', 'secretary', 'receptionist'];
        const filteredAdmin = directory.filter(official => 
          adminKeywords.some(keyword => 
            official.positionTitle?.toLowerCase().includes(keyword)
          )
        );
        
        const formattedAdmin = filteredAdmin.map(staff => ({
          id: staff.userId,
          name: staff.fullName,
          title: staff.positionTitle,
          isPresent: staff.present !== undefined ? staff.present : staff.isPresent
        }));
        
        setAdminStaffList(formattedAdmin);
      }
    } catch (error) {
      console.error("Failed to fetch admin staff:", error);
    } finally {
      setIsLoadingStaff(false);
    }
  }, [token]);

  useEffect(() => {
    fetchSchedule();
    fetchAdminStaff();
  }, [fetchSchedule, fetchAdminStaff]);

  const handleStatusUpdate = async (appointmentId, newStatus) => {
    if (newStatus === 'PENDING') return; 

    try {
      const response = await fetch(`${API_BASE_URL}/api/appointments/${appointmentId}/status?officialId=${user.userId}&status=${newStatus}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setToast({ message: `Appointment status updated to ${newStatus.replace('_', '-')}`, type: 'success' });
        fetchSchedule(); 
      } else {
        const errorText = await response.text();
        setToast({ message: `Failed to update status: ${errorText}`, type: 'error' });
      }
    } catch (error) {
      console.error("Error updating status:", error);
      setToast({ message: 'Network error occurred.', type: 'error' });
    }
  };

  const handleToggleAdminStaff = async (id, currentStatus) => {
    const newStatus = !currentStatus; 
    setAdminStaffList(adminStaffList.map(staff => 
      staff.id === id ? { ...staff, isPresent: newStatus } : staff
    ));

    try {
      const response = await fetch(`${API_BASE_URL}/api/officials/${id}/presence?isPresent=${newStatus}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        setToast({ message: 'Office availability updated.', type: 'success' });
      } else {
        setAdminStaffList(adminStaffList.map(staff => 
          staff.id === id ? { ...staff, isPresent: currentStatus } : staff
        ));
        setToast({ message: 'Failed to update availability.', type: 'error' });
      }
    } catch (error) {
      console.error("Error updating presence:", error);
      setToast({ message: 'Network error occurred.', type: 'error' });
    }
  };

  return (
    <div className="dashboard-wrapper">
      <Sidebar />
      <main className="main-content">
        <header className="dashboard-header">
          <div className="header-title">
            <h2>Community Scheduling</h2>
          </div>
          
          <div className="profile-section">
            <div className="profile-details" onClick={() => navigate('/profile')} style={{ cursor: 'pointer' }}>
              <span className="profile-name">{user?.fullname || "Official User"}</span>
              <span className="profile-role">Official</span>
            </div>
          </div>
        </header>

        <section className="dashboard-body">
          
          <div className="dashboard-card" style={{ marginBottom: '24px' }}>
             <h3 className="card-title">Executive Office Presence</h3>
             <p className="card-subtitle" style={{ marginBottom: '16px' }}>Manage the in/out board for administrative officials.</p>
             
             <div className="staff-toggle-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                {isLoadingStaff ? (
                  <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Loading office staff...</p>
                ) : adminStaffList.length > 0 ? (
                  adminStaffList.map(staff => (
                    <div className="staff-toggle-item" key={staff.id} style={{ marginBottom: 0 }}>
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
                          onChange={() => handleToggleAdminStaff(staff.id, staff.isPresent)} 
                        />
                        <span className="slider round"></span>
                      </label>
                    </div>
                  ))
                ) : (
                  <p style={{ fontSize: '0.85rem', color: '#64748b' }}>No administrative staff found.</p>
                )}
             </div>
          </div>

          <div className="schedule-filter-bar" style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
            <label style={{ fontWeight: '600', color: '#334155' }}>Viewing Schedule For:</label>
            <input 
              type="date" 
              className="form-control" 
              style={{ width: 'auto' }}
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
            <button className="btn-submit btn-sm" onClick={fetchSchedule}>Refresh</button>
          </div>

          <div className="dashboard-card" style={{ marginBottom: '24px' }}>
            <h3 className="card-title">Clinic Schedules</h3>
            <div className="table-responsive">
              <table className="official-table">
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Patient Name</th>
                    <th>Service</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {clinicSchedule.map((apt, index) => (
                    <tr key={index}>
                      <td className="fw-600">{apt.timeSlot}</td>
                      <td>{apt.fullName}</td>
                      <td>{apt.serviceType}</td>
                      <td>
                        <span className={`status-badge ${(apt.status || 'pending').toLowerCase()}`}>
                          {apt.status || 'Pending'}
                        </span>
                      </td>
                      <td style={{ width: '150px' }}>
                        <select 
                          className="form-control"
                          style={{ padding: '6px', fontSize: '0.85rem', cursor: 'pointer' }}
                          value={(apt.status || 'PENDING').toUpperCase()}
                          onChange={(e) => handleStatusUpdate(apt.appointmentId, e.target.value)}
                          disabled={apt.status?.toUpperCase() === 'COMPLETED' || apt.status?.toUpperCase() === 'REJECTED'}
                        >
                          <option value="PENDING" disabled>Pending</option>
                          <option value="APPROVED">Approve</option>
                          <option value="ON_GOING">On-Going</option>
                          <option value="COMPLETED">Mark as Done</option>
                          <option value="REJECTED">Reject</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                  {clinicSchedule.length === 0 && (
                    <tr><td colSpan="5" style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>No clinic appointments for this date.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="dashboard-card">
            <h3 className="card-title">Captain Counseling & Meetings</h3>
            <div className="table-responsive">
              <table className="official-table">
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Resident Name</th>
                    <th>Purpose / Notes</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {captainSchedule.map((apt, index) => (
                    <tr key={index}>
                      <td className="fw-600">{apt.timeSlot}</td>
                      <td>{apt.fullName}</td>
                      <td style={{ fontStyle: 'italic', color: '#64748b' }}>"{apt.notes || 'No notes provided'}"</td>
                      <td>
                        <span className={`status-badge ${(apt.status || 'pending').toLowerCase()}`}>
                          {apt.status || 'Pending'}
                        </span>
                      </td>
                      <td style={{ width: '150px' }}>
                         <select 
                          className="form-control"
                          style={{ padding: '6px', fontSize: '0.85rem', cursor: 'pointer' }}
                          value={(apt.status || 'PENDING').toUpperCase()}
                          onChange={(e) => handleStatusUpdate(apt.appointmentId, e.target.value)}
                          disabled={apt.status?.toUpperCase() === 'COMPLETED' || apt.status?.toUpperCase() === 'REJECTED'}
                        >
                          <option value="PENDING" disabled>Pending</option>
                          <option value="APPROVED">Approve</option>
                          <option value="ON_GOING">On-Going</option>
                          <option value="COMPLETED">Mark as Done</option>
                          <option value="REJECTED">Reject</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                  {captainSchedule.length === 0 && (
                    <tr><td colSpan="5" style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>No counseling appointments for this date.</td></tr>
                  )}
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

export default OfficialAppointments;