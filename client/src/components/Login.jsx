import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  // Estados para los campos del formulario
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Estados para feedback visual
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  /**
   * Manejar el envío del formulario
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Llamar a la función login del contexto
      await login(email, password);
      
      // Si tiene éxito, redirigir al dashboard (o home)
      navigate('/');
    } catch (err) {
      // Mostrar error al usuario
      setError(err.message || 'An error occurred during login');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="form-container">
        <h2>Iniciar Sesión</h2>
        
        {/* Mostrar error si existe */}
        {error && (
          <div className="error" role="alert">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="user-form">
          {/* Campo Email */}
          <div className="form-group">
            <label htmlFor="email">Correo:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Ingrese su correo"
              required
              autoComplete="email"
              disabled={loading}
            />
          </div>
          
          {/* Campo Password */}
          <div className="form-group">
            <label htmlFor="password">Contraseña:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ingrese su contraseña"
              required
              autoComplete="current-password"
              disabled={loading}
            />
          </div>
          
          {/* Botón Submit */}
          <div className="form-actions">
            <button 
              type="submit" 
              disabled={loading} 
              className="btn btn-primary"
            >
              {loading ? 'Logging in...' : 'Iniciar Sesión'}
            </button>
          </div>
        </form>
        
        {/* Link para registro */}
        <p style={{ marginTop: '1rem', textAlign: 'center' }}>
          No tienes una cuenta?{' '}
          <Link to="/register" style={{ color: '#3498db', textDecoration: 'underline' }}>
            Registrate aquí
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;