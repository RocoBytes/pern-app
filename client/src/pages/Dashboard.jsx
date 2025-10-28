import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Dashboard() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    if (window.confirm('¿Estás seguro de que deseas cerrar sesión?')) {
      logout();
    }
  };

  return (
    <div className="dashboard-container">
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
    </div>
  );
}

export default Dashboard;