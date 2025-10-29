import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Table, Button, Form, Container, Row, Col, Alert } from 'react-bootstrap';
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

      if (!response.ok) {
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

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          console.log('🔒 Token invalid, logging out');
          logout();
          return;
        }
        throw new Error(data.message || 'Error al actualizar el estado');
      }

      console.log('✅ Process updated successfully');

      setProcesses((prevProcesses) =>
        prevProcesses.map((process) =>
          process.id === id ? { ...process, estado: nuevoEstado } : process
        )
      );

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

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          console.log('🔒 Token invalid, logging out');
          logout();
          return;
        }
        throw new Error(data.message || 'Error al pausar el proceso');
      }

      console.log('✅ Process paused successfully');

      setProcesses((prevProcesses) =>
        prevProcesses.filter((process) => process.id !== id)
      );

      alert('Proceso pausado correctamente');
    } catch (err) {
      console.error('❌ Error pausing process:', err);
      alert(err.message || 'Error al pausar el proceso');
    }
  };

  /**
   * Formatear fecha a formato legible en español
   */
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
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
      <Container fluid className="mt-4 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando procesos...</span>
        </div>
        <p className="mt-3">Cargando procesos...</p>
      </Container>
    );
  }

  /**
   * Renderizar error
   */
  if (error) {
    return (
      <Container fluid className="mt-4">
        <Alert variant="danger">
          <Alert.Heading>Error</Alert.Heading>
          <p>{error}</p>
          <hr />
          <div className="d-flex gap-2">
            <Button onClick={fetchProcesses} variant="primary">
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

  /**
   * Renderizar tabla de procesos
   */
  return (
    <Container fluid className="mt-4">
      <Row className="mb-4">
        <Col>
          <h2>Consultar Procesos</h2>
        </Col>
        <Col xs="auto" className="d-flex gap-2">
          <Button 
            variant="outline-secondary" 
            size="sm" 
            onClick={fetchProcesses}
          >
            🔄 Actualizar
          </Button>
          <Link to="/crear-proceso">
            <Button variant="primary" size="sm">
              ➕ Nuevo Proceso
            </Button>
          </Link>
          <Link to="/">
            <Button variant="outline-secondary" size="sm">
              ← Dashboard
            </Button>
          </Link>
        </Col>
      </Row>

      {processes.length === 0 ? (
        <Alert variant="warning" className="text-center">
          <h4>📋 No hay procesos activos</h4>
          <p>Crea tu primer proceso para comenzar</p>
          <Link to="/crear-proceso">
            <Button variant="primary">Crear Proceso</Button>
          </Link>
        </Alert>
      ) : (
        <>
          <Alert variant="info">
            Mostrando <strong>{processes.length}</strong> proceso(s) activo(s)
          </Alert>

          <Table striped bordered hover responsive>
            <thead className="table-dark">
              <tr>
                <th>Repertorio</th>
                <th>Carátula</th>
                <th>Cliente</th>
                <th>Email</th>
                <th>Creado</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {processes.map((process) => (
                <tr key={process.id}>
                  <td>
                    <strong>{process.repertorio}</strong>
                  </td>
                  <td>{process.caratula || '-'}</td>
                  <td>{process.cliente || '-'}</td>
                  <td className="text-muted">{process.email_cliente || '-'}</td>
                  <td className="text-muted">{formatDate(process.created_at)}</td>
                  <td>
                    <Form.Select
                      size="sm"
                      value={process.estado}
                      onChange={(e) => handleStateChange(process.id, e.target.value)}
                    >
                      <option value="Iniciado">Iniciado</option>
                      <option value="Vigente">Vigente</option>
                      <option value="Terminado">Terminado</option>
                      <option value="Reparado">Reparado</option>
                    </Form.Select>
                  </td>
                  <td>
                    <div className="d-flex gap-2 justify-content-center">
                      <Button
                        variant="warning"
                        size="sm"
                        onClick={() => handlePause(process.id)}
                        title="Pausar proceso"
                      >
                        ⏸️
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        disabled
                        title="Ver detalles"
                      >
                        👁️
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

export default ConsultProcess;