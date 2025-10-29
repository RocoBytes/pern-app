import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Button, Container, Card, Alert } from 'react-bootstrap';
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
    <Container className="mt-4" style={{ maxWidth: '600px' }}>
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h4 className="mb-0">Crear Nuevo Proceso</h4>
          <Link to="/">
            <Button variant="outline-secondary" size="sm">
              ← Volver
            </Button>
          </Link>
        </Card.Header>

        <Card.Body>
          {/* Mostrar error si existe */}
          {error && (
            <Alert variant="danger" dismissible onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            {/* Campo Repertorio */}
            <Form.Group className="mb-3" controlId="formRepertorio">
              <Form.Label>
                Repertorio <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                name="repertorio"
                value={formData.repertorio}
                onChange={handleChange}
                placeholder="Ej: REP-2025-001"
                required
                disabled={loading}
                autoFocus
              />
            </Form.Group>

            {/* Campo Carátula */}
            <Form.Group className="mb-3" controlId="formCaratula">
              <Form.Label>Carátula</Form.Label>
              <Form.Control
                type="text"
                name="caratula"
                value={formData.caratula}
                onChange={handleChange}
                placeholder="Ej: Compraventa de Inmueble"
                disabled={loading}
              />
            </Form.Group>

            {/* Campo Cliente */}
            <Form.Group className="mb-3" controlId="formCliente">
              <Form.Label>Cliente</Form.Label>
              <Form.Control
                type="text"
                name="cliente"
                value={formData.cliente}
                onChange={handleChange}
                placeholder="Ej: Juan Pérez González"
                disabled={loading}
              />
            </Form.Group>

            {/* Campo Email Cliente */}
            <Form.Group className="mb-3" controlId="formEmailCliente">
              <Form.Label>Email Cliente</Form.Label>
              <Form.Control
                type="email"
                name="email_cliente"
                value={formData.email_cliente}
                onChange={handleChange}
                placeholder="Ej: cliente@example.com"
                disabled={loading}
              />
            </Form.Group>

            {/* Nota informativa */}
            <Alert variant="info" className="mb-3">
              <small>
                ℹ️ El proceso se creará con estado <strong>"Iniciado"</strong> por defecto.
              </small>
            </Alert>

            {/* Botones de acción */}
            <div className="d-flex gap-2">
              <Button 
                variant="primary" 
                type="submit" 
                disabled={loading}
                className="flex-grow-1"
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Creando...
                  </>
                ) : (
                  'Crear Proceso'
                )}
              </Button>
              
              <Button
                variant="outline-secondary"
                type="button"
                onClick={handleReset}
                disabled={loading}
              >
                Limpiar
              </Button>
              
              <Button
                variant="outline-danger"
                type="button"
                onClick={() => navigate('/consultar-procesos')}
                disabled={loading}
              >
                Cancelar
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default CreateProcess;