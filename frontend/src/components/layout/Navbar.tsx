import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogIn, UserPlus, Info, Star, Search, User, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if we're on the landing page
  const isLandingPage = location.pathname === '/';

  const handleLogout = async () => {
    try {
      logout();
      // Navigate to landing page immediately
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
      navigate('/', { replace: true });
    }
  };

  const scrollToSection = (sectionId: string) => {
    // If not on landing page, navigate to landing page first
    if (!isLandingPage) {
      navigate('/');
      // Wait for navigation then scroll
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        element?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      // Already on landing page, just scroll
      const element = document.getElementById(sectionId);
      element?.scrollIntoView({ behavior: 'smooth' });
    }
  };

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
          <div className="flex items-center space-x-6">
            {/* Main Navigation - Show only on landing page when not authenticated */}
            {isLandingPage && !isAuthenticated && (
              <div className="hidden md:flex items-center space-x-6">
                <button
                  onClick={() => scrollToSection('about-section')}
                  className="flex items-center space-x-1 px-3 py-2 text-sm text-secondary-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200"
                >
                  <Info className="h-4 w-4" />
                  <span>About Us</span>
                </button>
                
                <button
                  onClick={() => scrollToSection('features-section')}
                  className="flex items-center space-x-1 px-3 py-2 text-sm text-secondary-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200"
                >
                  <Star className="h-4 w-4" />
                  <span>Features</span>
                </button>
                
                <button
                  onClick={() => scrollToSection('reviews-section')}
                  className="flex items-center space-x-1 px-3 py-2 text-sm text-secondary-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200"
                >
                  <Search className="h-4 w-4" />
                  <span>Explore</span>
                </button>
              </div>
            )}

            {/* Auth Buttons */}
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                /* Authenticated User Menu */
                <>
                  <div className="flex items-center space-x-2 text-secondary-600">
                    {user?.profileImage ? (
                      <img 
                        src={user.profileImage} 
                        alt={user.fullName} 
                        className="h-8 w-8 rounded-full object-cover border-2 border-primary-200 cursor-pointer hover:border-primary-400 transition-colors"
                        onClick={() => navigate('/dashboard')}
                      />
                    ) : (
                      <User 
                        className="h-4 w-4 cursor-pointer hover:text-primary-600 transition-colors" 
                        onClick={() => navigate('/dashboard')}
                      />
                    )}
                    <span className="text-sm font-medium">{user?.fullName}</span>
                  </div>
                  
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                /* Guest User Buttons */
                <>
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
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
