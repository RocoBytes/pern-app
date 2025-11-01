import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Card, Table, Alert, Spinner, Form, Button, Badge } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

function ConsultProcess() {
  const { token, logout } = useAuth();
  const [processes, setProcesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProcesses();
  }, []);

  const fetchProcesses = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_URL}/api/processes`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          logout();
          return;
        }
        throw new Error(data.message || 'Error al cargar los procesos');
      }

      setProcesses(data.data);
    } catch (err) {
      console.error('Error al cargar procesos:', err);
      setError(err.message || 'Ocurrió un error al cargar los procesos');
    } finally {
      setLoading(false);
    }
  };

  const handleStateChange = async (id, nuevoEstado) => {
    try {
      const response = await fetch(`${API_URL}/api/processes/${id}/estado`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ estado: nuevoEstado }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          logout();
          return;
        }
        throw new Error(data.message || 'Error al actualizar el estado');
      }

      setProcesses((prevProcesses) =>
        prevProcesses.map((process) =>
          process.id === id ? { ...process, estado: nuevoEstado } : process
        )
      );

      alert('Estado actualizado correctamente');
    } catch (err) {
      console.error('Error al actualizar estado:', err);
      alert(err.message || 'Error al actualizar el estado');
    }
  };

  const getEstadoBadge = (estado) => {
    const badgeVariants = {
      'Iniciado': 'primary',
      'Vigente': 'success',
      'En Revisión': 'warning',
      'Terminado': 'info',
      'Reparado': 'secondary',
      'Cancelado': 'danger',
    };

    return <Badge bg={badgeVariants[estado] || 'secondary'}>{estado}</Badge>;
  };

  if (loading) {
    return (
      <Container className="mt-4 text-center">
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Cargando procesos...</span>
        </Spinner>
        <p className="mt-3">Cargando procesos...</p>
      </Container>
    );
  }

  return (
    <Container fluid className="mt-4">
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h4 className="mb-0">📊 Consultar Procesos</h4>
          <Button variant="primary" size="sm" onClick={fetchProcesses}>
            🔄 Actualizar
          </Button>
        </Card.Header>

        <Card.Body>
          {error && (
            <Alert variant="danger" dismissible onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          {processes.length === 0 ? (
            <Alert variant="info" className="text-center">
              <p className="mb-0">
                📋 No hay procesos registrados aún.
              </p>
              <small>Comienza creando tu primer proceso desde el menú.</small>
            </Alert>
          ) : (
            <div className="table-responsive">
              <Table striped bordered hover>
                <thead className="table-dark">
                  <tr>
                    <th>Repertorio</th>
                    <th>Carátula</th>
                    <th>Cliente</th>
                    <th>Email Cliente</th>
                    <th>Estado</th>
                    <th>Fecha Creación</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {processes.map((process) => (
                    <tr key={process.id}>
                      <td>
                        <Link 
                          to={`/proceso/${process.id}`}
                          className="text-decoration-none fw-bold"
                        >
                          {process.repertorio}
                        </Link>
                      </td>
                      <td>{process.caratula || '-'}</td>
                      <td>{process.cliente || '-'}</td>
                      <td>{process.email_cliente || '-'}</td>
                      <td>{getEstadoBadge(process.estado)}</td>
                      <td>
                        {new Date(process.created_at).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>
                      <td>
                        <Form.Select
                          size="sm"
                          value={process.estado}
                          onChange={(e) => handleStateChange(process.id, e.target.value)}
                          style={{ minWidth: '130px' }}
                        >
                          <option value="Iniciado">Iniciado</option>
                          <option value="Vigente">Vigente</option>
                          <option value="En Revisión">En Revisión</option>
                          <option value="Terminado">Terminado</option>
                          <option value="Reparado">Reparado</option>
                          <option value="Cancelado">Cancelado</option>
                        </Form.Select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}

          <div className="mt-3 text-muted">
            <small>
              ℹ️ Total de procesos: <strong>{processes.length}</strong>
            </small>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default ConsultProcess;