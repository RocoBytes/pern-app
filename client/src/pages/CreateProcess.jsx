import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

function CreateProcess() {
  const navigate = useNavigate();
  const { token, logout } = useAuth();

  // Estados para los campos del formulario
  const [formData, setFormData] = useState({
    repertorio: '',
    caratula: '',
    cliente: '',
    email_cliente: '',
  });

  // Estados para feedback visual
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  /**
   * Manejar cambios en los inputs
   */
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  /**
   * Manejar el envío del formulario
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validar que el repertorio no esté vacío
    if (!formData.repertorio.trim()) {
      setError('El repertorio es obligatorio');
      setLoading(false);
      return;
    }

    try {
      console.log('📝 Creating process:', formData);

      // Hacer POST a la API
      const response = await fetch(`${API_URL}/api/processes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      // Si la respuesta no es exitosa
      if (!response.ok) {
        // Si el token expiró o es inválido (401/403), cerrar sesión
        if (response.status === 401 || response.status === 403) {
          console.log('🔒 Token invalid, logging out');
          logout();
          return;
        }

        throw new Error(data.message || 'Error al crear el proceso');
      }

      console.log('✅ Process created successfully:', data);

      // Navegar a consultar procesos si fue exitoso
      navigate('/consultar-procesos');
    } catch (err) {
      console.error('❌ Error creating process:', err);
      setError(err.message || 'Ocurrió un error al crear el proceso');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Limpiar el formulario
   */
  const handleReset = () => {
    setFormData({
      repertorio: '',
      caratula: '',
      cliente: '',
      email_cliente: '',
    });
    setError(null);
  };

  return (
    <div className="form-container">
      <div className="form-header">
        <h2>Crear Nuevo Proceso</h2>
        <Link to="/" className="btn btn-secondary btn-small">
          ← Volver al Dashboard
        </Link>
      </div>

      {/* Mostrar error si existe */}
      {error && (
        <div className="error" role="alert">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="user-form">
        {/* Campo Repertorio */}
        <div className="form-group">
          <label htmlFor="repertorio">
            Repertorio: <span className="required">*</span>
          </label>
          <input
            type="text"
            id="repertorio"
            name="repertorio"
            value={formData.repertorio}
            onChange={handleChange}
            placeholder="Ej: REP-2025-001"
            required
            disabled={loading}
            autoFocus
          />
        </div>

        {/* Campo Carátula */}
        <div className="form-group">
          <label htmlFor="caratula">Carátula:</label>
          <input
            type="text"
            id="caratula"
            name="caratula"
            value={formData.caratula}
            onChange={handleChange}
            placeholder="Ej: Compraventa de Inmueble"
            disabled={loading}
          />
        </div>

        {/* Campo Cliente */}
        <div className="form-group">
          <label htmlFor="cliente">Cliente:</label>
          <input
            type="text"
            id="cliente"
            name="cliente"
            value={formData.cliente}
            onChange={handleChange}
            placeholder="Ej: Juan Pérez González"
            disabled={loading}
          />
        </div>

        {/* Campo Email Cliente */}
        <div className="form-group">
          <label htmlFor="email_cliente">Email Cliente:</label>
          <input
            type="email"
            id="email_cliente"
            name="email_cliente"
            value={formData.email_cliente}
            onChange={handleChange}
            placeholder="Ej: cliente@example.com"
            disabled={loading}
          />
        </div>

        {/* Nota informativa */}
        <div className="form-info">
          <p>
            ℹ️ El proceso se creará con estado <strong>"Iniciado"</strong> por defecto.
          </p>
        </div>

        {/* Botones de acción */}
        <div className="form-actions">
          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={loading}
          >
            {loading ? 'Creando...' : 'Crear Proceso'}
          </button>
          
          <button
            type="button"
            onClick={handleReset}
            className="btn btn-secondary"
            disabled={loading}
          >
            Limpiar
          </button>
          
          <button
            type="button"
            onClick={() => navigate('/consultar-procesos')}
            className="btn btn-secondary"
            disabled={loading}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateProcess;