import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { apiService } from '../services/ApiService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (fullName: string, email: string, password: string) => Promise<void>;
  logout: () => void;
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
    // Check if user is authenticated on app load
    const checkAuth = async () => {
      if (apiService.isAuthenticated()) {
        try {
          const { user } = await apiService.getUser();
          setUser(user);
        } catch (error) {
          console.error('Error fetching user:', error);
          apiService.removeToken();
        }
      }
      setIsLoading(false);
    };

    checkAuth();
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

  const register = async (fullName: string, email: string, password: string) => {
    try {
      const response = await apiService.createAccount(fullName, email, password);
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

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
