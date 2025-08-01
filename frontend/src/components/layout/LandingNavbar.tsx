import React from 'react';
import { Link } from 'react-router-dom';
import { LogIn, UserPlus } from 'lucide-react';

export const LandingNavbar: React.FC = () => {
  return (
    <nav className="bg-white/90 backdrop-blur-sm shadow-lg border-b border-secondary-200 fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <h1 className="text-xl font-bold font-serif text-primary-800">
              TrailWhisper
            </h1>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-4">
            <Link
              to="/login"
              className="flex items-center space-x-2 px-4 py-2 text-sm text-primary-600 hover:bg-primary-50 rounded-lg transition-colors duration-200"
            >
              <LogIn className="h-4 w-4" />
              <span>Login</span>
            </Link>
            
            <Link
              to="/register"
              className="flex items-center space-x-2 px-4 py-2 text-sm bg-primary-600 text-white hover:bg-primary-700 rounded-lg transition-colors duration-200"
            >
              <UserPlus className="h-4 w-4" />
              <span>Sign Up</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};
