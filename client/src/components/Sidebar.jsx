import React, { useState, useEffect } from 'react';
import { Nav, Button } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../App.css';

function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth();
  const location = useLocation();

  const handleLogout = () => {
    if (window.confirm('¿Estás seguro de que deseas cerrar sesión?')) {
      logout();
    }
  };

  const handleNavClick = () => {
    // Cerrar sidebar en móvil al hacer clic en un link
    if (window.innerWidth < 768) {
      onClose();
    }
  };

  return (
    <div className={`sidebar-wrapper ${isOpen ? 'open' : ''}`}>
      {/* Header del Sidebar */}
      <div className="sidebar-header">
        <h3>⚖️ Notaría 2.0</h3>
        <p>Sistema de Gestión</p>
      </div>

      {/* Navegación Principal */}
      <div className="sidebar-section">
        <div className="sidebar-section-title">Principal</div>
        <Nav variant="pills" className="flex-column" activeKey={location.pathname}>
          <Nav.Link 
            as={Link} 
            to="/" 
            eventKey="/"
            onClick={handleNavClick}
            className={location.pathname === '/' ? 'active' : ''}
          >
            <span className="icon">🏠</span>
            Dashboard
          </Nav.Link>
          <Nav.Link 
            as={Link} 
            to="/crear-proceso" 
            eventKey="/crear-proceso"
            onClick={handleNavClick}
            className={location.pathname === '/crear-proceso' ? 'active' : ''}
          >
            <span className="icon">📝</span>
            Crear Proceso
          </Nav.Link>
          <Nav.Link 
            as={Link} 
            to="/consultar-procesos" 
            eventKey="/consultar-procesos"
            onClick={handleNavClick}
            className={location.pathname === '/consultar-procesos' ? 'active' : ''}
          >
            <span className="icon">📊</span>
            Consultar Procesos
          </Nav.Link>
        </Nav>
      </div>

      {/* Divider */}
      <div className="sidebar-divider"></div>

      {/* Navegación Administración */}
      <div className="sidebar-section">
        <div className="sidebar-section-title">Administración</div>
        <Nav variant="pills" className="flex-column" activeKey={location.pathname}>
          <Nav.Link 
            as={Link} 
            to="/users" 
            eventKey="/users"
            onClick={handleNavClick}
            className={location.pathname === '/users' ? 'active' : ''}
          >
            <span className="icon">👥</span>
            Usuarios
          </Nav.Link>
        </Nav>
      </div>

      {/* Footer del Sidebar - Usuario y Logout */}
      <div className="sidebar-footer">
        {user && (
          <>
            <div className="user-info">
              <div className="user-avatar">
                {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
              </div>
              <div className="user-details">
                <p className="user-name">
                  {user.name || user.email.split('@')[0]}
                </p>
                <p className="user-email">{user.email}</p>
              </div>
            </div>
            <Button 
              variant="outline-light" 
              size="sm" 
              onClick={handleLogout}
              className="w-100 mt-2"
            >
              🚪 Cerrar Sesión
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

export default Sidebar;