import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { DashboardPage } from '../pages/DashboardPage';

export const DashboardWrapper: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect admin users to admin dashboard
    if (user && user.email === 'trailwhisper_admin') {
      navigate('/admin', { replace: true });
    }
  }, [user, navigate]);

  // If admin user, don't render regular dashboard (will redirect)
  if (user && user.email === 'trailwhisper_admin') {
    return null;
  }

  // Render regular dashboard for non-admin users
  return <DashboardPage />;
};
