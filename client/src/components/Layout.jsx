import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="app">
      <nav className="navbar">
        <h1>PERN App</h1>
        <ul>
          <li><Link to="/">Dashboard</Link></li>
          <li><Link to="/users">Users</Link></li>
          <li><Link to="/crear-proceso">Crear Proceso</Link></li>
          <li><Link to="/consultar-procesos">Consultar Procesos</Link></li>
          {user && (
            <>
              <li style={{ color: 'white' }}>👤 {user.email}</li>
              <li>
                <button onClick={handleLogout} className="btn btn-secondary">
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>
      </nav>
      <main className="container">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;