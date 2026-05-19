import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './shared/context/AuthContext';
import ProtectedRoute from './shared/utils/ProtectedRoute';
import Login from './features/auth/Login';
import Register from './features/auth/Register';
import ProfilePage from './features/profile/ProfilePage';
import ResidentDashboard from './features/dashboard/ResidentDashboard';
import OfficialDashboard from './features/dashboard/OfficialDashboard';
import OfficialClinic from './features/clinic/OfficialClinic';
import ResidentDocuments from './features/documents/ResidentDocuments';
import OfficialDocuments from './features/documents/OfficialDocuments';
import ResidentAppointments from './features/appointments/ResidentAppointments';
import OfficialAppointments from './features/appointments/OfficialAppointments';
import UserManagement from './features/admin/UserManagement';
import AdminDashboard from './features/admin/AdminDashboard';
import AdminProfile from './features/admin/AdminProfile';

const RoleRoute = ({ residentComponent: ResidentComp, officialComponent: OfficialComp }) => {
  const { user } = useAuth();
  if (user?.role === 'Official' || user?.role === 'Admin') {
    return <OfficialComp />;
  }
  return <ResidentComp />;
};

const DashboardRouter = () => {
  const { user } = useAuth();
  if (user?.role === 'Admin') return <AdminDashboard />;
  if (user?.role === 'Official') return <OfficialDashboard />;
  return <ResidentDashboard />;
};

const ProfileRouter = () => {
  const { user } = useAuth();
  if (user?.role === 'Admin') return <AdminProfile />;
  return <ProfilePage />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/admin/users" element={<ProtectedRoute><UserManagement /></ProtectedRoute>} />
          
          <Route path="/profile" element={<ProtectedRoute><ProfileRouter /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardRouter /></ProtectedRoute>} />
          
          <Route 
            path="/clinic" 
            element={<ProtectedRoute><RoleRoute officialComponent={OfficialClinic} /></ProtectedRoute>} 
          />

          <Route 
            path="/documents" 
            element={<ProtectedRoute><RoleRoute residentComponent={ResidentDocuments} officialComponent={OfficialDocuments} /></ProtectedRoute>} 
          />
          
          <Route 
            path="/schedules" 
            element={<ProtectedRoute><RoleRoute residentComponent={ResidentAppointments} officialComponent={OfficialAppointments} /></ProtectedRoute>} 
          />
          
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;