import React, { useState } from 'react';
import Sidebar from './reusable/Sidebar';
import './reusable/Dashboard.css'; 
import './reusable/OfficialClinic.css'; 
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const OfficialAppointments = () => {
  const navigate = useNavigate();
  const { user, token, logout } = useAuth();
  const [ setToast] = useState({ message: '', type: '' });
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [clinicSchedule] = useState([
    { id: 'APT-111', time: '08:00 AM', name: 'Maria Clara', service: 'General Consultation', status: 'Approved' },
    { id: 'APT-222', time: '09:00 AM', name: 'Juan Dela Cruz', service: 'Vaccination', status: 'Approved' },
    { id: 'APT-333', time: '10:00 AM', name: 'Ana Reyes', service: 'Blood Pressure', status: 'Pending' },
  ]);
  const [captainSchedule] = useState([
    { id: 'APT-444', time: '01:00 PM', name: 'Pedro Penduko', notes: 'Dispute resolution with neighbor', status: 'Approved' },
    { id: 'APT-555', time: '03:00 PM', name: 'Andres Bonifacio', notes: 'Seeking advice for local business', status: 'Approved' },
  ]);


  const handleStatusUpdate = async (appointmentId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:8080/api/appointments/${appointmentId}/status?officialId=${user.userId}&status=${newStatus}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}` 
        }
      });

      if (response.ok) {
        setToast({ message: `Appointment marked as ${newStatus}`, type: 'success' });
        
        
      } else {
        setToast({ message: 'Failed to update status.', type: 'error' });
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };
  const handleLogoutClick = () => {
    setToast({ message: 'Logging out successfully...', type: 'info' });
    setTimeout(() => {
      logout();
      navigate('/login');
    }, 1500);
  };

  return (
    <div className="dashboard-wrapper">
      <Sidebar onLogout={handleLogoutClick} />
      
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
          
          {/* Global Date Filter */}
          <div className="schedule-filter-bar" style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
            <label style={{ fontWeight: '600', color: '#334155' }}>Viewing Schedule For:</label>
            <input 
              type="date" 
              className="form-control" 
              style={{ width: 'auto' }}
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
            <button className="btn-submit btn-sm">Refresh</button>
          </div>

          {/* BOX 1: Clinic Schedules */}
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
                      <td className="fw-600">{apt.time}</td>
                      <td>{apt.name}</td>
                      <td>{apt.service}</td>
                      <td><span className={`status-badge ${apt.status.toLowerCase()}`}>{apt.status}</span></td>
                      <td>
                        <button className="btn-action complete" onClick={() => handleStatusUpdate(apt.id, 'Completed')}>Mark Done</button>
                      </td>
                    </tr>
                  ))}
                  {clinicSchedule.length === 0 && (
                    <tr><td colSpan="5" style={{ textAlign: 'center' }}>No clinic appointments for this date.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* BOX 2: Captain Counseling */}
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
                      <td className="fw-600">{apt.time}</td>
                      <td>{apt.name}</td>
                      <td style={{ fontStyle: 'italic', color: '#64748b' }}>"{apt.notes}"</td>
                      <td><span className={`status-badge ${apt.status.toLowerCase()}`}>{apt.status}</span></td>
                      <td>
                         <button className="btn-action complete">Mark Done</button>
                      </td>
                    </tr>
                  ))}
                  {captainSchedule.length === 0 && (
                    <tr><td colSpan="5" style={{ textAlign: 'center' }}>No counseling appointments for this date.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </section>
      </main>
    </div>
  );
};

export default OfficialAppointments;