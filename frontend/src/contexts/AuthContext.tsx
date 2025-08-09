import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { apiService } from '../services/ApiService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (fullName: string, email: string, password: string, profileImage?: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set a maximum time for initial loading to prevent hanging
    const maxLoadTime = setTimeout(() => {
      console.warn('Auth check taking too long, proceeding without auth');
      setIsLoading(false);
    }, 3000); // 3 seconds max

    // Check if user is authenticated on app load
    const checkAuth = async () => {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      if (!token) {
        // No token found, load immediately without API call
        clearTimeout(maxLoadTime);
        setIsLoading(false);
        return;
      }

      // Token exists, try to get user data with timeout
      try {
        const { user } = await apiService.getUser();
        setUser(user);
      } catch (error) {
        console.error('Error fetching user:', error);
        // Remove invalid token
        apiService.removeToken();
        setUser(null);
      } finally {
        clearTimeout(maxLoadTime);
        setIsLoading(false);
      }
    };

    checkAuth();

    return () => {
      clearTimeout(maxLoadTime);
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await apiService.login(email, password);
      if (response.error) {
        throw new Error(response.message);
      }
      
      if (response.accessToken && response.user) {
        apiService.saveToken(response.accessToken);
        setUser(response.user);
      }
    } catch (error) {
      throw error;
    }
  };

  const register = async (fullName: string, email: string, password: string, profileImage?: string) => {
    try {
      const response = profileImage 
        ? await apiService.createAccountWithImage(fullName, email, password, profileImage)
        : await apiService.createAccount(fullName, email, password);
      
      if (response.error) {
        throw new Error(response.message);
      }
      
      if (response.accessToken && response.user) {
        apiService.saveToken(response.accessToken);
        setUser(response.user);
      }
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    apiService.removeToken();
    setUser(null);
  };

  const refreshUser = async () => {
    if (apiService.isAuthenticated()) {
      try {
        const { user } = await apiService.getUser();
        setUser(user);
      } catch (error) {
        console.error('Error refreshing user:', error);
      }
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
