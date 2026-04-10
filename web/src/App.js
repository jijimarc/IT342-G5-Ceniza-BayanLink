import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import ProfilePage from './components/ProfilePage';
import ClinicPage from './components/ClinicPage';
import DocumentsPage from './components/DocumentsPage';
import AppointmentsPage from './components/AppointmentsPage';
import { AuthProvider } from './components/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />

          <Route path="/login" element={<Login />} />

          <Route path="/register" element={<Register />} />

          <Route path="/dashboard" element={<Dashboard />} />
          
          <Route path="/profile" element={<ProfilePage />} />

          <Route path="/clinic" element={<ClinicPage />} />

          <Route path="/documents" element={<DocumentsPage />} />
          
          <Route path="/schedules" element={<AppointmentsPage />} />
          
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
