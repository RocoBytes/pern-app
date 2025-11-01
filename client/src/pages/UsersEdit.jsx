import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Form, Button, Container, Card, Alert } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

function UsersEdit() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { token, logout } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchingUser, setFetchingUser] = useState(true);

  // Cargar datos del usuario
  useEffect(() => {
    const fetchUser = async () => {
      try {
        console.log('📥 Fetching user:', id);

        const response = await fetch(`${API_URL}/api/users/${id}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            console.log('🔒 Token invalid, logging out');
            logout();
            return;
          }
          throw new Error(data.message || 'Error al cargar el usuario');
        }

        console.log('✅ User loaded:', data.data);
        setFormData({
          name: data.data.name || '',
          email: data.data.email || '',
          password: '',
        });
      } catch (err) {
        console.error('❌ Error fetching user:', err);
        setError(err.message || 'Error al cargar el usuario');
      } finally {
        setFetchingUser(false);
      }
    };

    fetchUser();
  }, [id, token, logout]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (loading) return;
    
    setLoading(true);
    setError(null);

    try {
      console.log('✏️ Updating user:', id);

      // Preparar datos para actualizar (solo incluir password si se ingresó)
      const updateData = {
        name: formData.name,
        email: formData.email,
      };

      if (formData.password.trim()) {
        updateData.password = formData.password;
      }

      const response = await fetch(`${API_URL}/api/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          console.log('🔒 Token invalid, logging out');
          logout();
          return;
        }
        throw new Error(data.message || 'Error al actualizar el usuario');
      }

      console.log('✅ User updated successfully');
      navigate('/users');
    } catch (err) {
      console.error('❌ Error updating user:', err);
      setError(err.message || 'Error al actualizar el usuario');
    } finally {
      setLoading(false);
    }
  };

  if (fetchingUser) {
    return (
      <Container className="mt-4 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando usuario...</span>
        </div>
        <p className="mt-3">Cargando usuario...</p>
      </Container>
    );
  }

  return (
    <Container className="mt-4" style={{ maxWidth: '600px' }}>
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h4 className="mb-0">Editar Usuario</h4>
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
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Dejar vacío para no cambiar"
                disabled={loading}
                minLength={6}
              />
              <Form.Text className="text-muted">
                Dejar vacío si no desea cambiar la contraseña. Mínimo 6 caracteres.
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
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Actualizando...
                  </>
                ) : (
                  'Actualizar Usuario'
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

export default UsersEdit;