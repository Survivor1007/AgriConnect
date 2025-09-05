import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

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
  const [refreshToken, setRefreshToken] = useState<string | null>(null);

  // Login function
  const login = async (username: string, password: string) => {
    try {
      const response = await fetch('http://localhost:8000/api/token/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed. Please check your credentials.');
      }

      const data = await response.json();
      setAccessToken(data.access_token);
      setRefreshToken(data.refresh_token);

      console.log('Login successful! Tokens received.');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  // ✅ Signup function
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
      const response = await fetch('http://localhost:8000/api/signup/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          password,
          email,
          phone,
          location,
          is_farmer: isFarmer,
          is_buyer: isBuyer,
        }),
      });

      if (!response.ok) {
        throw new Error('Signup failed. Please check your details.');
      }

      const data = await response.json();

      // if backend returns tokens immediately after signup
      if (data.access && data.refresh) {
        setAccessToken(data.access);
        setRefreshToken(data.refresh);
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
    console.log('User logged out.');
  };

  // Refresh function
  const refresh = async (): Promise<string | null> => {
    if (!refreshToken) {
      logout();
      return null;
    }

    try {
      const response = await fetch('http://localhost:8000/api/token/refresh/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (!response.ok) {
        throw new Error('Token refresh failed.');
      }

      const data = await response.json();
      setAccessToken(data.access);
      console.log('Access token refreshed successfully.');
      return data.access;
    } catch (error) {
      console.error('Token refresh error:', error);
      logout();
      return null;
    }
  };

  const isAuthenticated = !!accessToken;

  const value = {
    accessToken,
    refreshToken,
    login,
    signup, // ✅ exposed to context
    logout,
    isAuthenticated,
    refresh,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
