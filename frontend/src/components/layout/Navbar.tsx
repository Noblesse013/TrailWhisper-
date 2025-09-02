
import React, { useRef, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogIn, UserPlus, Info, Star, Search, User, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import logoSvg from '../../assets/logo.svg';


export const Navbar: React.FC = () => {

  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showProfileCard, setShowProfileCard] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  
  const isLandingPage = location.pathname === '/';

  
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileCard(false);
      }
    }
    if (showProfileCard) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfileCard]);

  const handleLogout = () => {
    
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    
    window.location.href = '/';
  };

  const scrollToSection = (sectionId: string) => {
    
    if (!isLandingPage) {
      navigate('/');
      
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        element?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      
      const element = document.getElementById(sectionId);
      element?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="bg-white/90 backdrop-blur-sm shadow-lg border-b border-secondary-200 fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
        
          <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <img 
              src={logoSvg} 
              alt="TrailWhisper Logo" 
              className="h-10 w-10"
            />
            <h1 className="text-xl font-bold font-serif text-primary-800">
              TrailWhisper
            </h1>
          </Link>

          
          <div className="flex items-center space-x-6">
            
            {isLandingPage && (
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

            
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
              
                <>
                  <div className="flex items-center space-x-2 text-secondary-600 relative" ref={profileRef}>
                    {user?.profileImage ? (
                      <img 
                        src={user.profileImage} 
                        alt={user.fullName} 
                        className="h-8 w-8 rounded-full object-cover border-2 border-primary-200 cursor-pointer hover:border-primary-400 transition-colors"
                        onClick={() => setShowProfileCard((v) => !v)}
                      />
                    ) : (
                      <User 
                        className="h-4 w-4 cursor-pointer hover:text-primary-600 transition-colors" 
                        onClick={() => setShowProfileCard((v) => !v)}
                      />
                    )}
                    <span className="text-sm font-medium">{user?.fullName}</span>

                    
                    {showProfileCard && (
                      <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-lg border border-secondary-200 z-50 p-4 animate-fade-in">
                        <div className="flex flex-col items-center mb-3">
                          {user?.profileImage ? (
                            <img src={user.profileImage} alt={user.fullName} className="h-16 w-16 rounded-full object-cover border-2 border-primary-200 mb-2" />
                          ) : (
                            <div className="h-16 w-16 rounded-full bg-secondary-100 flex items-center justify-center mb-2">
                              <User className="h-8 w-8 text-secondary-400" />
                            </div>
                          )}
                          <div className="text-lg font-bold text-primary-800">{user?.fullName}</div>
                          <div className="text-sm text-secondary-600 mb-2">{user?.email}</div>
                        </div>
                        <button
                          onClick={() => {
                            if (location.pathname === '/' && user?.email === 'trailwhisper_admin') {
                              navigate('/admin');
                            } else if (location.pathname === '/admin' || location.pathname === '/dashboard') {
                              navigate('/');
                            } else {
                              navigate('/dashboard');
                            }
                            setShowProfileCard(false);
                          }}
                          className="w-full flex items-center justify-center space-x-2 px-4 py-2 mb-2 text-sm text-primary-600 hover:bg-primary-50 rounded-lg transition-colors duration-200"
                        >
                          <User className="h-4 w-4" />
                          <span>
                            {location.pathname === '/' && user?.email === 'trailwhisper_admin' 
                              ? 'Go to Dashboard' 
                              : location.pathname === '/admin' || location.pathname === '/dashboard'
                              ? 'Go to Landing Page'
                              : 'Go to Dashboard'}
                          </span>
                        </button>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center justify-center space-x-2 px-4 py-2 mb-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                        >
                          <LogOut className="h-4 w-4" />
                          <span>Logout</span>
                        </button>
                        <button
                          onClick={() => setShowProfileCard(false)}
                          className="w-full px-4 py-2 text-sm text-secondary-600 hover:bg-secondary-50 rounded-lg transition-colors duration-200"
                        >
                          Close
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
               
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


