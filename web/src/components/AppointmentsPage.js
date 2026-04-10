import React, { useState, useEffect } from 'react';
import Sidebar from './reusable/Sidebar';
import './reusable/Dashboard.css'; 
import './reusable/Appointments.css'; 
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import Toast from './reusable/Toast';

const AppointmentsPage = () => {
  const navigate = useNavigate();
  const { user, token, logout } = useAuth();
  const [toast, setToast] = useState({ message: '', type: '' });
  const today = new Date().toISOString().split('T')[0];
  const displayName = user?.isGuest ? "Guest User" : (user?.fullname || user?.email || "User");
  const [summary, setSummary] = useState('');
  const [formData, setFormData] = useState({
    service: '',
    date: '',
    timeSlot: '',
    notes: ''
  });

  

  // Replace the single array with these two
  const morningSlots = ["08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM"];
  const afternoonSlots = ["01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM"];

  useEffect(() => {
    if (formData.service || formData.date || formData.timeSlot) {
      setSummary(
        `Service: ${formData.service || 'Not selected'}\n` +
        `Date: ${formData.date || 'Not selected'}\n` +
        `Time: ${formData.timeSlot || 'Not selected'}\n\n` +
        `Additional Notes: ${formData.notes || 'None'}`
      );
    } else {
      setSummary('');
    }
  }, [formData]);

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

  const handleTimeSelect = (slot) => {
    setFormData({ ...formData, timeSlot: slot });
  };

  const handleClear = () => {
    setFormData({ service: '', date: '', timeSlot: '', notes: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.service || !formData.date || !formData.timeSlot) {
      setToast({ message: 'Please select a service, date, and time slot.', type: 'error' });
      return;
    }

    const requestPayload = {
      userId: user.userId,
      serviceType: formData.service,
      appointmentDate: formData.date,
      timeSlot: formData.timeSlot,
      notes: formData.notes
    };

    try {
      const response = await fetch('http://localhost:8080/api/appointments/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestPayload)
      });

      if (response.ok) {
        const savedAppointment = await response.json();
        setToast({ message: `Appointment booked! Ref: ${savedAppointment.referenceNumber}`, type: 'success' });
        handleClear();
      } else {
        const errorMessage = await response.text();
        setToast({ message: `Failed to book: ${errorMessage}`, type: 'error' });
      }
    } catch (error) {
      console.error("Booking error:", error);
      setToast({ message: 'Network error occurred.', type: 'error' });
    }
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
              <span className="profile-name">{displayName}</span>
              <span className="profile-role">{user?.isGuest ? 'Guest' : (user?.role || 'User')}</span>
            </div>
          </div>
        </header>

        <section className="dashboard-body">
          <div className="dashboard-card">
            
            <form className="schedule-form" onSubmit={handleSubmit}>
              
              <div className="schedule-top-grid">
                
                <div className="schedule-col">
                  <div className="form-group">
                    <label>Choose service</label>
                    <select 
                      name="service" 
                      className="form-control"
                      value={formData.service}
                      onChange={handleChange}
                    >
                      <option value="" disabled>Select a service</option>
                      <option value="Clinic Check-up">Clinic Check-up</option>
                      <option value="Document Pick-up">Document Pick-up</option>
                      <option value="Barangay Official Meeting">Barangay Official Meeting</option>
                      <option value="Counseling">Counseling</option>
                    </select>
                  </div>

                  <div className="form-group h-100">
                    <label>Available Time Slots</label>
                    
                    {/* Morning Block */}
                    <div className="time-group" style={{ marginBottom: '12px' }}>
                      <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '8px', fontWeight: '600' }}>MORNING</p>
                      <div className="time-slots-container">
                        {morningSlots.map((slot, index) => (
                          <button
                            key={`morning-${index}`}
                            type="button"
                            className={`time-slot-btn ${formData.timeSlot === slot ? 'active' : ''}`}
                            onClick={() => handleTimeSelect(slot)}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Afternoon Block */}
                    <div className="time-group">
                      <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '8px', fontWeight: '600' }}>AFTERNOON</p>
                      <div className="time-slots-container">
                        {afternoonSlots.map((slot, index) => (
                          <button
                            key={`afternoon-${index}`}
                            type="button"
                            className={`time-slot-btn ${formData.timeSlot === slot ? 'active' : ''}`}
                            onClick={() => handleTimeSelect(slot)}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>

                <div className="schedule-col">
                  <div className="form-group">
                    <label>Pick a Date</label>
                    <input 
                      type="date" 
                      name="date"
                      className="form-control date-picker-lg"
                      value={formData.date}
                      onChange={handleChange}
                      min={today}
                    />
                  </div>
                  
                  <div className="form-group h-100" style={{ marginTop: '20px' }}>
                     <label>Additional Notes (Optional)</label>
                     <textarea 
                        name="notes"
                        className="form-control textarea-control"
                        value={formData.notes}
                        onChange={handleChange}
                        placeholder="Any special requests or details?"
                     />
                  </div>
                </div>
              </div>

              <div className="schedule-bottom-section">
                <div className="form-group">
                  <label>Summary</label>
                  <textarea 
                    className="form-control summary-box"
                    value={summary}
                    readOnly
                    placeholder="Your scheduling summary will appear here..."
                  />
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="btn-remove" onClick={handleClear}>Remove</button>
                <button type="submit" className="btn-submit">Submit</button>
              </div>

            </form>
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

export default AppointmentsPage;