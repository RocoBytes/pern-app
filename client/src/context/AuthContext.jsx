import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Crear el contexto de autenticación
const AuthContext = createContext(null);

// URL base de la API
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

/**
 * Decodificar JWT token para obtener el payload
 * @param {string} token - JWT token
 * @returns {object} Payload decodificado
 */
const decodeToken = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

/**
 * Proveedor del contexto de autenticación
 */
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * Cargar token desde localStorage al iniciar la app
   */
  useEffect(() => {
    console.log('🔍 AuthProvider: Initializing...');
    const storedToken = localStorage.getItem('token');
    console.log('🔍 Stored token:', storedToken ? 'Found' : 'Not found');
    
    if (storedToken) {
      const decoded = decodeToken(storedToken);
      console.log('🔍 Decoded token:', decoded);
      
      if (decoded && decoded.exp * 1000 > Date.now()) {
        console.log('✅ Token is valid');
        setToken(storedToken);
        setUser({
          userId: decoded.userId,
          email: decoded.email,
        });
      } else {
        console.log('⚠️ Token expired');
        localStorage.removeItem('token');
      }
    }
    
    setLoading(false);
    console.log('✅ AuthProvider: Initialized');
  }, []);

  /**
   * Función para iniciar sesión
   * @param {string} email - Email del usuario
   * @param {string} password - Contraseña del usuario
   * @returns {Promise<object>} Datos de respuesta
   */
  const login = async (email, password) => {
    try {
      console.log('🔐 Attempting login for:', email);
      const response = await axios.post(`${API_URL}/api/auth/login`, {
        email,
        password,
      });

      console.log('✅ Login response:', response.data);
      const { token: newToken, user: userData } = response.data.data;

      // Guardar token en localStorage
      localStorage.setItem('token', newToken);

      // Decodificar token para obtener información del usuario
      const decoded = decodeToken(newToken);

      // Actualizar estado
      setToken(newToken);
      setUser({
        userId: decoded.userId,
        email: decoded.email,
        ...userData,
      });

      console.log('✅ Login successful');
      return { success: true, data: response.data };
    } catch (error) {
      console.error('❌ Login error:', error);
      
      // Manejar diferentes tipos de errores
      if (error.response) {
        throw new Error(error.response.data.message || 'Login failed');
      } else if (error.request) {
        throw new Error('No response from server. Please check your connection.');
      } else {
        throw new Error('An error occurred during login');
      }
    }
  };

  /**
   * Función para registrar nuevo usuario
   * @param {string} email - Email del usuario
   * @param {string} password - Contraseña del usuario
   * @returns {Promise<object>} Datos de respuesta
   */
  const register = async (email, password) => {
    try {
      console.log('📝 Attempting register for:', email);
      const response = await axios.post(`${API_URL}/api/auth/register`, {
        email,
        password,
      });

      console.log('✅ Register response:', response.data);
      const { token: newToken, user: userData } = response.data.data;

      // Guardar token en localStorage
      localStorage.setItem('token', newToken);

      // Decodificar token para obtener información del usuario
      const decoded = decodeToken(newToken);

      // Actualizar estado
      setToken(newToken);
      setUser({
        userId: decoded.userId,
        email: decoded.email,
        ...userData,
      });

      console.log('✅ Registration successful');
      return { success: true, data: response.data };
    } catch (error) {
      console.error('❌ Register error:', error);
      
      // Manejar diferentes tipos de errores
      if (error.response) {
        throw new Error(error.response.data.message || 'Registration failed');
      } else if (error.request) {
        throw new Error('No response from server. Please check your connection.');
      } else {
        throw new Error('An error occurred during registration');
      }
    }
  };

  /**
   * Función para cerrar sesión
   */
  const logout = () => {
    console.log('🚪 Logging out...');
    // Remover token de localStorage
    localStorage.removeItem('token');

    // Limpiar estado
    setToken(null);
    setUser(null);
  };

  /**
   * Verificar si el usuario está autenticado
   */
  const isAuthenticated = () => {
    const authenticated = !!token && !!user;
    console.log('🔍 Is authenticated:', authenticated);
    return authenticated;
  };

  // Valor del contexto a exportar
  const value = {
    token,
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated,
  };

  console.log('🔍 AuthProvider rendering, loading:', loading);

  return (
    <AuthContext.Provider value={value}>
      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p className="loading-text">Initializing application...</p>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

/**
 * Hook personalizado para usar el contexto de autenticación
 * @returns {object} Contexto de autenticación
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

export default AuthContext;