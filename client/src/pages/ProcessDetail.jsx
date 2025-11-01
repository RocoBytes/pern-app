import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Spinner, 
  Alert, 
  Button, 
  ListGroup,
  Badge 
} from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import ProcessTimeline from '../components/ProcessTimeline';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

function ProcessDetail() {
  const { id } = useParams();
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  
  const [proceso, setProceso] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProcessDetail();
  }, [id, token]);

  const fetchProcessDetail = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_URL}/api/processes/${id}`, {
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
        if (response.status === 404) {
          setError('Proceso no encontrado o no tienes permiso para verlo.');
        } else {
          setError(data.message || 'No se pudo cargar el proceso.');
        }
        return;
      }

      setProceso(data.data);
    } catch (err) {
      console.error('Error al cargar el proceso:', err);
      setError('Ocurrió un error al cargar el proceso.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
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

    return <Badge bg={badgeVariants[estado] || 'secondary'} className="fs-6">
      {estado}
    </Badge>;
  };

  // Renderizado de Loading
  if (loading) {
    return (
      <Container className="mt-4 text-center">
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Cargando proceso...</span>
        </Spinner>
        <p className="mt-3">Cargando detalles del proceso...</p>
      </Container>
    );
  }

  // Renderizado de Error
  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">
          <Alert.Heading>❌ Error</Alert.Heading>
          <p>{error}</p>
          <hr />
          <div className="d-flex gap-2">
            <Button 
              variant="outline-danger" 
              onClick={() => navigate('/consultar-procesos')}
            >
              ← Volver a Procesos
            </Button>
            <Button 
              variant="danger" 
              onClick={fetchProcessDetail}
            >
              🔄 Reintentar
            </Button>
          </div>
        </Alert>
      </Container>
    );
  }

  // Renderizado del Proceso
  return (
    <Container fluid className="mt-4">
      {/* Header con breadcrumb y acciones */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-2">
              <li className="breadcrumb-item">
                <Link to="/">Dashboard</Link>
              </li>
              <li className="breadcrumb-item">
                <Link to="/consultar-procesos">Procesos</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                {proceso?.repertorio}
              </li>
            </ol>
          </nav>
          <h2 className="mb-0">📋 Detalle del Proceso</h2>
        </div>
        <div className="d-flex gap-2">
          <Button 
            variant="outline-secondary" 
            onClick={() => navigate('/consultar-procesos')}
          >
            ← Volver
          </Button>
          <Button 
            variant="primary" 
            onClick={fetchProcessDetail}
          >
            🔄 Actualizar
          </Button>
        </div>
      </div>

      <Row>
        <Col lg={12}>
          {/* Card Principal */}
          <Card className="mb-4 shadow-sm">
            <Card.Header className="bg-primary text-white">
              <div className="d-flex justify-content-between align-items-center">
                <h4 className="mb-0">
                  ⚖️ {proceso?.repertorio}
                </h4>
                {getEstadoBadge(proceso?.estado)}
              </div>
            </Card.Header>

            <Card.Body>
              {/* Línea de Tiempo del Estado */}
              <section className="mb-4">
                <h5 className="mb-3">📊 Línea de Estado</h5>
                <ProcessTimeline currentStatus={proceso?.estado} />
              </section>

              <hr />

              {/* Información General */}
              <section>
                <h5 className="mb-3">ℹ️ Información General</h5>
                <Row>
                  <Col md={6}>
                    <ListGroup variant="flush">
                      <ListGroup.Item>
                        <div className="d-flex justify-content-between">
                          <strong>📝 Carátula:</strong>
                          <span className="text-end">{proceso?.caratula || '-'}</span>
                        </div>
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <div className="d-flex justify-content-between">
                          <strong>👤 Cliente:</strong>
                          <span className="text-end">{proceso?.cliente || '-'}</span>
                        </div>
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <div className="d-flex justify-content-between">
                          <strong>📧 Email Cliente:</strong>
                          <span className="text-end">
                            {proceso?.email_cliente ? (
                              <a href={`mailto:${proceso.email_cliente}`}>
                                {proceso.email_cliente}
                              </a>
                            ) : '-'}
                          </span>
                        </div>
                      </ListGroup.Item>
                    </ListGroup>
                  </Col>

                  <Col md={6}>
                    <ListGroup variant="flush">
                      <ListGroup.Item>
                        <div className="d-flex justify-content-between">
                          <strong>🆔 ID del Proceso:</strong>
                          <span className="text-end text-muted font-monospace small">
                            {proceso?.id}
                          </span>
                        </div>
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <div className="d-flex justify-content-between">
                          <strong>📅 Fecha de Creación:</strong>
                          <span className="text-end">{formatDate(proceso?.created_at)}</span>
                        </div>
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <div className="d-flex justify-content-between">
                          <strong>🔄 Última Actualización:</strong>
                          <span className="text-end">{formatDate(proceso?.updated_at)}</span>
                        </div>
                      </ListGroup.Item>
                    </ListGroup>
                  </Col>
                </Row>
              </section>
            </Card.Body>

            <Card.Footer className="text-muted">
              <small>
                💡 <strong>Tip:</strong> Puedes actualizar el estado del proceso desde la página de consulta.
              </small>
            </Card.Footer>
          </Card>
        </Col>
      </Row>

      {/* Card Adicional - Acciones Rápidas */}
      <Row>
        <Col lg={12}>
          <Card className="shadow-sm">
            <Card.Header>
              <h5 className="mb-0">⚡ Acciones Rápidas</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-flex flex-wrap gap-2">
                <Button variant="outline-primary">
                  ✏️ Editar Proceso
                </Button>
                <Button variant="outline-success">
                  📎 Adjuntar Documento
                </Button>
                <Button variant="outline-info">
                  💬 Agregar Nota
                </Button>
                <Button variant="outline-warning">
                  📧 Notificar Cliente
                </Button>
                <Button variant="outline-danger">
                  🗑️ Eliminar Proceso
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default ProcessDetail;