import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import API from '../api/axios';

// Define the shape of the authentication context state
export interface AuthContextType {
  accessToken: string | null;
  refreshToken: string | null;
  login: (username: string, password: string) => Promise<void>;
  signup: (
    username: string,
    password: string,
    email: string,
    phone: string,
    location: string,
    isFarmer: boolean,
    isBuyer: boolean
  ) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAuthReady: boolean; // ✅ Added isAuthReady to the context type
  refresh: () => Promise<string | null>;
}

// Create the context with a default value of `null`
const AuthContext = createContext<AuthContextType | null>(null);

// Custom hook to use the AuthContext, providing type safety
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Define the props for the AuthProvider component
interface AuthProviderProps {
  children: ReactNode;
}

// AuthProvider component to wrap the application and provide authentication state
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(
    localStorage.getItem('refreshToken')
  );
  const [isAuthReady, setIsAuthReady] = useState(false);

  // Login function
  const login = async (username: string, password: string) => {
    try {
      const response = await API.post('http://localhost:8000/api/token/', {
        username,
        password,
      });

      const data = response.data;
      setAccessToken(data.access);
      setRefreshToken(data.refresh);
      localStorage.setItem("accessToken", data.access);
      localStorage.setItem('refreshToken', data.refresh);
      console.log('Login successful! Tokens received.');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  // Signup function
  const signup = async (
    username: string,
    password: string,
    email: string,
    phone: string,
    location: string,
    isFarmer: boolean,
    isBuyer: boolean
  ) => {
    try {
      const response = await API.post('http://localhost:8000/api/signup/', {
        username,
        password,
        email,
        phone,
        location,
        is_farmer: isFarmer,
        is_buyer: isBuyer,
      });

      const data = response.data;
      // if backend returns tokens immediately after signup
      if (data.access && data.refresh) {
        setAccessToken(data.access);
        setRefreshToken(data.refresh);
        localStorage.setItem("accessToken", data.access);
        localStorage.setItem('refreshToken', data.refresh);
        console.log('Signup successful! User registered and tokens received.');
      } else {
        console.log('Signup successful! Please login.');
      }
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    setAccessToken(null);
    setRefreshToken(null);
    localStorage.removeItem('refreshToken');
    console.log('User logged out.');
  };

  // Refresh function
  const refresh = async (): Promise<string | null> => {
    if (!refreshToken) {
      logout();
      return null;
    }

    try {
      const response = await API.post('http://localhost:8000/api/token/refresh/', {
        refresh: refreshToken,
      });

      const data = response.data;
      setAccessToken(data.access);
      console.log('Access token refreshed successfully.');
      return data.access;
    } catch (error) {
      console.error('Token refresh error:', error);
      logout();
      return null;
    }
  };

  // The key change is here: check authentication status on mount and when refreshToken changes
  useEffect(() => {
    const checkAuth = async () => {
      if (refreshToken) {
        try {
          await refresh();
        } catch {
          // The `refresh` function already logs out on failure, so we don't need to do it here.
        }
      }
      setIsAuthReady(true);
    };

    checkAuth();
  }, [refreshToken]);

  const isAuthenticated = !!accessToken;

  const value = {
    accessToken,
    refreshToken,
    login,
    signup,
    logout,
    isAuthenticated,
    isAuthReady,
    refresh,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
