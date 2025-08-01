import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { LogOut, User } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      logout();
      // Small delay to ensure state is updated before navigation
      setTimeout(() => {
        window.location.href = '/';
      }, 100);
    } catch (error) {
      console.error('Logout error:', error);
      window.location.href = '/';
    }
  };

  return (
    <nav className="bg-white shadow-lg border-b border-secondary-200 fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex items-center space-x-3">
    
            <h1 className="text-xl font-bold font-serif text-primary-800">
              TrailWhisper
            </h1>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-secondary-600">
              <User className="h-4 w-4" />
              <span className="text-sm font-medium">{user?.fullName}</span>
            </div>
            
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
