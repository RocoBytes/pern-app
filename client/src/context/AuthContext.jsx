import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

/**
 * Proveedor del contexto de autenticación
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * Cargar usuario y token del localStorage al iniciar
   */
  useEffect(() => {
    console.log('🔄 AuthProvider: Initializing...');
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        console.log('✅ AuthProvider: Found stored credentials', { email: parsedUser.email });
        setToken(storedToken);
        setUser(parsedUser);
      } catch (error) {
        console.error('❌ AuthProvider: Error parsing stored user', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    } else {
      console.log('ℹ️ AuthProvider: No stored credentials found');
    }

    setLoading(false);
  }, []);

  /**
   * Función para iniciar sesión
   * @param {string} newToken - Nuevo token JWT
   * @param {object} newUser - Datos del usuario
   */
  const login = (newToken, newUser) => {
    console.log('🔐 AuthContext: login called', { 
      hasToken: !!newToken, 
      hasUser: !!newUser,
      userEmail: newUser?.email 
    });
    
    try {
      if (!newToken || !newUser) {
        throw new Error('Token y usuario son requeridos');
      }

      // Guardar en localStorage
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(newUser));
      
      // Actualizar estado
      setToken(newToken);
      setUser(newUser);
      
      console.log('✅ AuthContext: Login successful, token and user saved');
    } catch (error) {
      console.error('❌ AuthContext: Error during login', error);
      throw error;
    }
  };

  /**
   * Función para cerrar sesión
   */
  const logout = () => {
    console.log('🚪 AuthContext: logout called');
    
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    
    console.log('✅ AuthContext: Logout successful');
  };

  /**
   * Verificar si el usuario está autenticado
   */
  const isAuthenticated = () => {
    const authenticated = !!token && !!user;
    console.log('🔍 AuthContext: isAuthenticated check', { 
      authenticated, 
      hasToken: !!token, 
      hasUser: !!user 
    });
    return authenticated;
  };

  // Valor del contexto a exportar
  const value = {
    user,
    token,
    loading,
    login,
    logout,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Hook personalizado para usar el contexto de autenticación
 * @returns {object} Contexto de autenticación
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export default AuthContext;