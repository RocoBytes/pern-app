import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

function ConsultProcess() {
  const { token, logout } = useAuth();

  // Estados
  const [processes, setProcesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Obtener procesos desde la API
   */
  const fetchProcesses = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔍 Fetching processes...');

      const response = await fetch(`${API_URL}/api/processes`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
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

        throw new Error(data.message || 'Error al cargar los procesos');
      }

      console.log('✅ Processes loaded:', data.count);
      setProcesses(data.data);
    } catch (err) {
      console.error('❌ Error fetching processes:', err);
      setError(err.message || 'Ocurrió un error al cargar los procesos');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Cambiar el estado de un proceso
   */
  const handleStateChange = async (id, nuevoEstado) => {
    try {
      console.log(`🔄 Updating process ${id} to '${nuevoEstado}'`);

      const response = await fetch(`${API_URL}/api/processes/${id}/estado`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ estado: nuevoEstado }),
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

        throw new Error(data.message || 'Error al actualizar el estado');
      }

      console.log('✅ Process updated successfully');

      // Actualizar el estado local con el proceso actualizado
      setProcesses((prevProcesses) =>
        prevProcesses.map((process) =>
          process.id === id ? { ...process, estado: nuevoEstado } : process
        )
      );

      // Mostrar notificación de éxito (opcional)
      alert('Estado actualizado correctamente');
    } catch (err) {
      console.error('❌ Error updating process:', err);
      alert(err.message || 'Error al actualizar el estado');
    }
  };

  /**
   * Pausar un proceso
   */
  const handlePause = async (id) => {
    // Pedir confirmación al usuario
    const confirmPause = window.confirm(
      '¿Estás seguro de que deseas pausar este proceso? El proceso desaparecerá de la lista activa.'
    );

    if (!confirmPause) {
      return;
    }

    try {
      console.log(`⏸️  Pausing process ${id}`);

      const response = await fetch(`${API_URL}/api/processes/${id}/estado`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ estado: 'Pausado' }),
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

        throw new Error(data.message || 'Error al pausar el proceso');
      }

      console.log('✅ Process paused successfully');

      // IMPORTANTE: Filtrar el proceso del estado local
      // ya que no aparecerá en el próximo GET
      setProcesses((prevProcesses) =>
        prevProcesses.filter((process) => process.id !== id)
      );

      // Mostrar notificación de éxito
      alert('Proceso pausado correctamente');
    } catch (err) {
      console.error('❌ Error pausing process:', err);
      alert(err.message || 'Error al pausar el proceso');
    }
  };

  /**
   * Cargar procesos al montar el componente
   */
  useEffect(() => {
    fetchProcesses();
  }, []);

  /**
   * Renderizar estado de carga
   */
  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p className="loading-text">Cargando procesos...</p>
      </div>
    );
  }

  /**
   * Renderizar error
   */
  if (error) {
    return (
      <div className="form-container">
        <h2>Consultar Procesos</h2>
        <div className="error" role="alert">
          {error}
        </div>
        <button onClick={fetchProcesses} className="btn btn-primary">
          Reintentar
        </button>
        <Link to="/" className="btn btn-secondary" style={{ marginLeft: '1rem' }}>
          Volver al Dashboard
        </Link>
      </div>
    );
  }

  /**
   * Renderizar lista de procesos
   */
  return (
    <div className="consult-container">
      <div className="consult-header">
        <h2>Consultar Procesos</h2>
        <div className="header-actions">
          <button onClick={fetchProcesses} className="btn btn-secondary btn-small">
            🔄 Actualizar
          </button>
          <Link to="/crear-proceso" className="btn btn-primary btn-small">
            ➕ Nuevo Proceso
          </Link>
          <Link to="/" className="btn btn-secondary btn-small">
            ← Dashboard
          </Link>
        </div>
      </div>

      {processes.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h3>No hay procesos activos</h3>
          <p>Crea tu primer proceso para comenzar</p>
          <Link to="/crear-proceso" className="btn btn-primary">
            Crear Proceso
          </Link>
        </div>
      ) : (
        <>
          <div className="process-stats">
            <p>
              Mostrando <strong>{processes.length}</strong> proceso(s) activo(s)
            </p>
          </div>

          <div className="process-list">
            {processes.map((process) => (
              <div key={process.id} className="process-item">
                <div className="process-info">
                  <div className="process-field">
                    <span className="field-label">📋 Repertorio:</span>
                    <span className="field-value">{process.repertorio}</span>
                  </div>

                  {process.caratula && (
                    <div className="process-field">
                      <span className="field-label">📄 Carátula:</span>
                      <span className="field-value">{process.caratula}</span>
                    </div>
                  )}

                  {process.cliente && (
                    <div className="process-field">
                      <span className="field-label">👤 Cliente:</span>
                      <span className="field-value">{process.cliente}</span>
                    </div>
                  )}

                  {process.email_cliente && (
                    <div className="process-field">
                      <span className="field-label">📧 Email:</span>
                      <span className="field-value">{process.email_cliente}</span>
                    </div>
                  )}

                  <div className="process-field">
                    <span className="field-label">📅 Creado:</span>
                    <span className="field-value">
                      {new Date(process.created_at).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                </div>

                <div className="process-controls">
                  <div className="control-group">
                    <label htmlFor={`estado-${process.id}`}>Estado:</label>
                    <select
                      id={`estado-${process.id}`}
                      value={process.estado}
                      onChange={(e) => handleStateChange(process.id, e.target.value)}
                      className="estado-select"
                    >
                      <option value="Iniciado">Iniciado</option>
                      <option value="Vigente">Vigente</option>
                      <option value="Terminado">Terminado</option>
                      <option value="Reparado">Reparado</option>
                    </select>
                  </div>

                  <button
                    onClick={() => handlePause(process.id)}
                    className="btn btn-pause"
                    title="Pausar proceso"
                  >
                    ⏸️ Pausar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default ConsultProcess;