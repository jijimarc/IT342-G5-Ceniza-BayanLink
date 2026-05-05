import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// --- Shared Utils & Context ---
import { AuthProvider, useAuth } from './shared/context/AuthContext';
import ProtectedRoute from './shared/utils/ProtectedRoute';

// --- Auth Feature ---
import Login from './features/auth/Login';
import Register from './features/auth/Register';

// --- Profile Feature ---
import ProfilePage from './features/profile/ProfilePage';

// --- Dashboard Feature ---
import ResidentDashboard from './features/dashboard/ResidentDashboard';
import OfficialDashboard from './features/dashboard/OfficialDashboard';

// --- Clinic Feature ---
import ResidentClinic from './features/clinic/ResidentClinic';
import OfficialClinic from './features/clinic/OfficialClinic';

// --- Documents Feature ---
import ResidentDocuments from './features/documents/ResidentDocuments';
import OfficialDocuments from './features/documents/OfficialDocuments';

// --- Appointments Feature ---
import ResidentAppointments from './features/appointments/ResidentAppointments';
import OfficialAppointments from './features/appointments/OfficialAppointments';

/**
 * Traffic Controller Component
 * Checks the user's role and serves the correct UI component.
 */
const RoleRoute = ({ residentComponent: ResidentComp, officialComponent: OfficialComp }) => {
  const { user } = useAuth();
  
  if (user?.role === 'Official' || user?.role === 'Admin') {
    return <OfficialComp />;
  }
  
  // Default to Resident view
  return <ResidentComp />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* ==========================================
              PUBLIC ROUTES
              ========================================== */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* ==========================================
              PROTECTED SHARED ROUTES
              ========================================== */}
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <ProfilePage /> {/* Profile handles its own internal logic */}
              </ProtectedRoute>
            } 
          />

          {/* ==========================================
              PROTECTED ROLE-BASED ROUTES
              ========================================== */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <RoleRoute 
                  residentComponent={ResidentDashboard} 
                  officialComponent={OfficialDashboard} 
                />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/clinic" 
            element={
              <ProtectedRoute>
                <RoleRoute 
                  residentComponent={ResidentClinic} 
                  officialComponent={OfficialClinic} 
                />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/documents" 
            element={
              <ProtectedRoute>
                <RoleRoute 
                  residentComponent={ResidentDocuments} 
                  officialComponent={OfficialDocuments} 
                />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/schedules" 
            element={
              <ProtectedRoute>
                <RoleRoute 
                  residentComponent={ResidentAppointments} 
                  officialComponent={OfficialAppointments} 
                />
              </ProtectedRoute>
            } 
          />
          
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;