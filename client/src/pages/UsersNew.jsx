import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Button, Container, Card, Alert } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

function UsersNew() {
  const navigate = useNavigate();
  const { token, logout } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      console.log('👤 Creating new user...');

      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          console.log('🔒 Token invalid, logging out');
          logout();
          return;
        }
        throw new Error(data.message || 'Error al crear el usuario');
      }

      console.log('✅ User created successfully');
      navigate('/users');
    } catch (err) {
      console.error('❌ Error creating user:', err);
      setError(err.message || 'Error al crear el usuario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-4" style={{ maxWidth: '600px' }}>
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h4 className="mb-0">Crear Nuevo Usuario</h4>
          <Link to="/users">
            <Button variant="outline-secondary" size="sm">
              ← Volver
            </Button>
          </Link>
        </Card.Header>

        <Card.Body>
          {error && (
            <Alert variant="danger" dismissible onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          <Alert variant="info" className="mb-3">
            <small>
              ℹ️ Solo usuarios autenticados pueden crear nuevas cuentas
            </small>
          </Alert>

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formName">
              <Form.Label>
                Nombre <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Nombre completo"
                required
                disabled={loading}
                autoFocus
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Label>
                Correo Electrónico <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="correo@ejemplo.com"
                required
                disabled={loading}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formPassword">
              <Form.Label>
                Contraseña <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                disabled={loading}
                minLength={6}
              />
              <Form.Text className="text-muted">
                Mínimo 6 caracteres
              </Form.Text>
            </Form.Group>

            <div className="d-flex gap-2">
              <Button
                variant="primary"
                type="submit"
                disabled={loading}
                className="flex-grow-1"
              >
                {loading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Creando...
                  </>
                ) : (
                  'Crear Usuario'
                )}
              </Button>

              <Button
                variant="outline-danger"
                type="button"
                onClick={() => navigate('/users')}
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

export default UsersNew;