import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Container, Row, Col, Card } from 'react-bootstrap';
import SimpleBarChart from '../components/SimpleBarChart';
import SimpleRadialChart from '../components/SimpleRadialChart';

function Dashboard() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    if (window.confirm('¿Estás seguro de que deseas cerrar sesión?')) {
      logout();
    }
  };

  return (
    <Container fluid className="mt-4">
      <div className="dashboard-header">
        <h1>Menú Principal</h1>
        {user && (
          <div className="user-info">
            <span className="user-email">👤 {user.email}</span>
            <button onClick={handleLogout} className="btn btn-logout">
              Cerrar Sesión
            </button>
          </div>
        )}
      </div>

      <Row>
        <Col md={12} lg={6} className="mb-4">
          <Card>
            <Card.Header>
              <h5 className="mb-0">📊 Procesos por Estado</h5>
            </Card.Header>
            <Card.Body>
              <SimpleBarChart />
            </Card.Body>
          </Card>
        </Col>

        <Col md={12} lg={6} className="mb-4">
          <Card>
            <Card.Header>
              <h5 className="mb-0">📈 Distribución Radial</h5>
            </Card.Header>
            <Card.Body>
              <SimpleRadialChart />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <div className="dashboard-grid">
        <Link to="/crear-proceso" className="dashboard-card">
          <div className="card-icon">📝</div>
          <h2>Crear Proceso</h2>
          <p>Registra un nuevo proceso notarial</p>
        </Link>

        <Link to="/consultar-procesos" className="dashboard-card">
          <div className="card-icon">📊</div>
          <h2>Consultar Procesos</h2>
          <p>Visualiza y gestiona tus procesos</p>
        </Link>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Procesos Activos</h3>
          <p className="stat-number">--</p>
        </div>
        <div className="stat-card">
          <h3>Procesos Terminados</h3>
          <p className="stat-number">--</p>
        </div>
        <div className="stat-card">
          <h3>Procesos Pausados</h3>
          <p className="stat-number">--</p>
        </div>
      </div>

      {/* Más contenido del dashboard */}
      <Row>
        <Col md={12} className="mb-4">
          <Card>
            <Card.Header>
              <h5 className="mb-0">📋 Resumen General</h5>
            </Card.Header>
            <Card.Body>
              <p>Contenido adicional del dashboard...</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Dashboard;