import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Table, Button, Container, Alert } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import userService from '../services/userService';

function Home() {
  const { token, logout } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await userService.getUsers(token);
      setUsers(data.data);
    } catch (err) {
      console.error('❌ Error fetching users:', err);
      
      if (err.message.includes('401') || err.message.includes('403')) {
        logout();
        return;
      }
      
      setError(err.message || 'Error al cargar los usuarios');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      return;
    }

    try {
      await userService.deleteUser(id, token);
      setUsers(users.filter(user => user.id !== id));
    } catch (err) {
      console.error('❌ Error deleting user:', err);
      
      if (err.message.includes('401') || err.message.includes('403')) {
        logout();
        return;
      }
      
      alert(err.message || 'Error al eliminar el usuario');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) {
    return (
      <Container className="mt-4 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando usuarios...</span>
        </div>
        <p className="mt-3">Cargando usuarios...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">
          <Alert.Heading>Error</Alert.Heading>
          <p>{error}</p>
          <hr />
          <div className="d-flex gap-2">
            <Button onClick={fetchUsers} variant="primary">
              Reintentar
            </Button>
            <Link to="/">
              <Button variant="secondary">Volver al Dashboard</Button>
            </Link>
          </div>
        </Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Gestión de Usuarios</h2>
        <div className="d-flex gap-2">
          <Button variant="outline-secondary" size="sm" onClick={fetchUsers}>
            🔄 Actualizar
          </Button>
          <Link to="/users/new">
            <Button variant="primary" size="sm">
              ➕ Nuevo Usuario
            </Button>
          </Link>
          <Link to="/">
            <Button variant="outline-secondary" size="sm">
              ← Dashboard
            </Button>
          </Link>
        </div>
      </div>

      {users.length === 0 ? (
        <Alert variant="warning" className="text-center">
          <h4>👥 No hay usuarios registrados</h4>
          <p>Crea el primer usuario para comenzar</p>
          <Link to="/users/new">
            <Button variant="primary">Crear Usuario</Button>
          </Link>
        </Alert>
      ) : (
        <>
          <Alert variant="info">
            Mostrando <strong>{users.length}</strong> usuario(s)
          </Alert>

          <Table striped bordered hover responsive>
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Email</th>
                <th>Fecha de Creación</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    {new Date(user.created_at).toLocaleDateString('es-ES', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </td>
                  <td>
                    <div className="d-flex gap-2 justify-content-center">
                      <Link to={`/users/${user.id}/edit`}>
                        <Button variant="warning" size="sm">
                          ✏️ Editar
                        </Button>
                      </Link>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(user.id)}
                      >
                        🗑️ Eliminar
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}
    </Container>
  );
}

export default Home;