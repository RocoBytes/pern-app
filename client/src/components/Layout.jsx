import { Outlet, Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../App.css';

function Layout() {
  const { user, logout } = useAuth();

  return (
    <div className="app-wrapper">
      {/* Sidebar */}
      <aside className="sidebar-wrapper">
        <div className="sidebar-header">
          <h3>Notaría 2.0</h3>
          <p>Sistema de Gestión</p>
        </div>

        <nav>
          <div className="sidebar-section">
            <div className="sidebar-section-title">Principal</div>
            <ul className="sidebar-nav">
              <li>
                <NavLink to="/" end>
                  <span className="icon">🏠</span>
                  Dashboard
                </NavLink>
              </li>
              <li>
                <NavLink to="/crear-proceso">
                  <span className="icon">📝</span>
                  Crear Proceso
                </NavLink>
              </li>
              <li>
                <NavLink to="/consultar-procesos">
                  <span className="icon">📊</span>
                  Consultar Procesos
                </NavLink>
              </li>
            </ul>
          </div>

          <div className="sidebar-divider"></div>

          <div className="sidebar-section">
            <div className="sidebar-section-title">Administración</div>
            <ul className="sidebar-nav">
              <li>
                <NavLink to="/users">
                  <span className="icon">👥</span>
                  Usuarios
                </NavLink>
              </li>
            </ul>
          </div>
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">
              {user?.email?.charAt(0).toUpperCase()}
            </div>
            <div className="user-details">
              <p className="user-name">{user?.email?.split('@')[0]}</p>
              <p className="user-email">{user?.email}</p>
            </div>
          </div>
          <button 
            onClick={logout} 
            className="btn btn-outline-light btn-sm w-100"
          >
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Contenido Principal */}
      <main className="content-wrapper">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;