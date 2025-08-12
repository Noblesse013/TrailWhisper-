import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { DashboardPage } from '../pages/DashboardPage';

export const DashboardWrapper: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    
    if (user && user.email === 'trailwhisper_admin') {
      navigate('/admin', { replace: true });
    }
  }, [user, navigate]);

  
  if (user && user.email === 'trailwhisper_admin') {
    return null;
  }

  
  return <DashboardPage />;
};
