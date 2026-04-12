import React from 'react'; 
import { useAuth } from './AuthContext';
import OfficialDashboard from './OfficialDashboard';
import ResidentDashboard from './ResidentDashboard';
import { Navigate } from 'react-router-dom';

const DashboardController = () => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  if (user.role === 'Official' || user.role === 'Admin') {
    return <OfficialDashboard />;
  }

  return <ResidentDashboard />; 
};

export default DashboardController;