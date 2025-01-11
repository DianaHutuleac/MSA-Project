import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true); // To ensure context is ready before rendering

  useEffect(() => {
    const loadToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('authToken');
        if (storedToken) {
          console.log('Stored Token:', storedToken); // Log the correct variable
          const decoded = jwtDecode(storedToken);
          console.log('Decoded Token:', decoded); // Log decoded token
          
          setToken(storedToken);
          setUserId(decoded.sub);
        } else {
          console.log('No token found in AsyncStorage');
        }
      } catch (error) {
        console.error('Error loading token:', error);
      } finally {
        setLoading(false); // Ensure loading is set to false
      }
    };

    loadToken();
  }, [token]);

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('authToken');
      setToken(null);
      setUserId(null);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  if (loading) {
    return null; // Render nothing until token is loaded
  }

  return (
    <AuthContext.Provider value={{ token, setToken, userId, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
