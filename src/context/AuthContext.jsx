import React, { createContext, useState, useEffect, useContext } from 'react';
import apiClient from '../api/client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('access_token'));
  const [currentUser, setCurrentUser] = useState(null);
  const [currentClass, setCurrentClassState] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user profile on boot if access_token exists
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('access_token');
      if (storedToken) {
        try {
          const res = await apiClient.get('/api/auth/me');
          setCurrentUser(res.data);
          
          // Sync current class state with user's registered class
          if (res.data.studentClass?.grade) {
            setCurrentClassState(res.data.studentClass.grade);
            localStorage.setItem('class_level', res.data.studentClass.grade);
          }
        } catch (err) {
          console.error('Failed to initialize user session:', err);
          // Reset local auth states if profile fetch fails
          localStorage.clear();
          setToken(null);
          setCurrentUser(null);
          setCurrentClassState(null);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, [token]);

  // Login handler
  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const res = await apiClient.post('/api/auth/login', { email, password });
      const { token: jwtToken, user } = res.data;
      
      // Store tokens and metadata in localStorage as required by Integration Rules
      localStorage.setItem('access_token', jwtToken);
      localStorage.setItem('refresh_token', jwtToken); // Using the same JWT token as fallback
      localStorage.setItem('user_id', user.id || '');
      localStorage.setItem('role', user.role || 'student');
      localStorage.setItem('full_name', user.fullName || '');
      localStorage.setItem('class_level', user.studentClass?.grade || '');

      setToken(jwtToken);
      setCurrentUser(user);
      
      if (user.studentClass?.grade) {
        setCurrentClassState(user.studentClass.grade);
      }
      return user;
    } catch (err) {
      console.error('Login action failed:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout handler
  const logout = async () => {
    try {
      await apiClient.post('/api/auth/logout');
    } catch (err) {
      console.error('Server logout failed:', err);
    } finally {
      localStorage.clear();
      setToken(null);
      setCurrentUser(null);
      setCurrentClassState(null);
    }
  };

  // Update profile details
  const updateProfile = async (fullName) => {
    try {
      const res = await apiClient.put('/api/auth/me', { fullName });
      const updatedUser = res.data; // Django /api/auth/me PUT returns the updated user doc directly
      
      setCurrentUser(updatedUser);
      localStorage.setItem('full_name', updatedUser.fullName || '');
      if (updatedUser.studentClass?.grade) {
        setCurrentClassState(updatedUser.studentClass.grade);
        localStorage.setItem('class_level', updatedUser.studentClass.grade);
      }
      return updatedUser;
    } catch (err) {
      console.error('Profile update failed:', err);
      throw err;
    }
  };

  // Helper to change class active context manually (Locked - read only)
  const setCurrentClass = async (grade) => {
    console.warn('Class is locked and cannot be changed manually.');
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        currentUser,
        currentClass,
        isLoading,
        login,
        logout,
        updateProfile,
        setCurrentClass,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
