import React, { useState, useEffect } from 'react';
import Sidebar from './reusable/Sidebar';
import './reusable/Dashboard.css'; // Reuses main layout styling
import './reusable/Schedules.css'; // Specific styling for this page in the reusable folder
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import Toast from './reusable/Toast';

const Schedules = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [toast, setToast] = useState({ message: '', type: '' });

  const displayName = user?.isGuest ? "Guest User" : (user?.fullname || user?.email || "User");

  // Scheduling State
  const [formData, setFormData] = useState({
    service: '',
    date: '',
    timeSlot: '',
    notes: ''
  });

  const [summary, setSummary] = useState('');

  // Available time slots (Mock data)
  const availableSlots = [
    "08:00 AM", "09:00 AM", "10:30 AM", 
    "01:00 PM", "02:30 PM", "04:00 PM"
  ];

  // Auto-update the summary when fields change
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.service || !formData.date || !formData.timeSlot) {
      setToast({ message: 'Please select a service, date, and time slot.', type: 'error' });
      return;
    }
    setToast({ message: 'Schedule requested successfully!', type: 'success' });
    handleClear();
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
              
              {/* Top Section: Split Layout */}
              <div className="schedule-top-grid">
                
                {/* Left Column: Service & Time */}
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
                    <div className="time-slots-container">
                      {availableSlots.map((slot, index) => (
                        <button
                          key={index}
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

                {/* Right Column: Date Picker */}
                <div className="schedule-col">
                  <div className="form-group">
                    <label>Pick a Date</label>
                    <input 
                      type="date" 
                      name="date"
                      className="form-control date-picker-lg"
                      value={formData.date}
                      onChange={handleChange}
                    />
                  </div>
                  
                  {/* Optional: Add notes to the right column to balance the layout */}
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

              {/* Bottom Section: Summary */}
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

              {/* Actions */}
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

export default Schedules;