import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  
  // Estados para los campos del formulario
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
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

    // Validar que las contraseñas coincidan
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    // Validar longitud mínima
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      // Llamar a la función register del contexto
      await register(email, password);
      
      // Si tiene éxito, redirigir al dashboard (o home)
      navigate('/');
    } catch (err) {
      // Mostrar error al usuario
      setError(err.message || 'An error occurred during registration');
      console.error('Register error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="form-container">
        <h2>Register</h2>
        
        {/* Mostrar error si existe */}
        {error && (
          <div className="error" role="alert">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="user-form">
          {/* Campo Email */}
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              autoComplete="email"
              disabled={loading}
            />
          </div>
          
          {/* Campo Password */}
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password (min 6 characters)"
              required
              autoComplete="new-password"
              disabled={loading}
              minLength={6}
            />
          </div>
          
          {/* Campo Confirm Password */}
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password:</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              required
              autoComplete="new-password"
              disabled={loading}
              minLength={6}
            />
          </div>
          
          {/* Botón Submit */}
          <div className="form-actions">
            <button 
              type="submit" 
              disabled={loading} 
              className="btn btn-primary"
            >
              {loading ? 'Registering...' : 'Register'}
            </button>
          </div>
        </form>
        
        {/* Link para login */}
        <p style={{ marginTop: '1rem', textAlign: 'center' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#3498db', textDecoration: 'underline' }}>
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;