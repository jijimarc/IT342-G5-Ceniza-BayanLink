import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// --- Auth & Security ---
import { AuthProvider, useAuth } from './components/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// --- Public Pages ---
import Login from './components/Login';
import Register from './components/Register';

// --- Shared Pages ---
import ProfilePage from './components/ProfilePage';

// --- Resident Pages ---
import ResidentDashboard from './components/ResidentDashboard';
import ResidentClinic from './components/ResidentClinic';
import ResidentDocuments from './components/ResidentDocuments';
import ResidentAppointments from './components/ResidentAppointments';

// --- Official Pages ---
import OfficialDashboard from './components/OfficialDashboard';
import OfficialClinic from './components/OfficialClinic';
import OfficialDocuments from './components/OfficialDocuments';
import OfficialAppointments from './components/OfficialAppointments';

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