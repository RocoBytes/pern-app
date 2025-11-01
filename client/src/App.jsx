import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Navbar, Container } from 'react-bootstrap';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './components/Login';
import Dashboard from './pages/Dashboard';
import CreateProcess from './pages/CreateProcess';
import ConsultProcess from './pages/ConsultProcess';
import ProcessDetail from './pages/ProcessDetail';
import Home from './pages/Home';
import UsersNew from './pages/UsersNew';
import UsersEdit from './pages/UsersEdit';
import NotFound from './pages/NotFound';
import { useAuth } from './context/AuthContext';
import './App.css';

function App() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <Routes>
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        
        <Route path="/*" element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

function AppLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Función para toggle del sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Cerrar sidebar cuando cambia la ruta en móvil
  useEffect(() => {
    const handleRouteChange = () => {
      setIsSidebarOpen(false);
    };

    // Escuchar cambios de ruta
    window.addEventListener('popstate', handleRouteChange);

    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  // Prevenir scroll del body cuando sidebar está abierto en móvil
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isSidebarOpen]);

  return (
    <div className={isSidebarOpen ? "app-wrapper sidebar-open" : "app-wrapper"}>
      {/* Navbar Superior para Móvil (solo visible en pantallas pequeñas) */}
      <Navbar bg="dark" variant="dark" expand="lg" className="d-lg-none fixed-top">
        <Container fluid>
          <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
            <span className="me-2">⚖️</span>
            Notaría 2.0
          </Navbar.Brand>
          <Navbar.Toggle 
            onClick={toggleSidebar} 
            aria-controls="responsive-navbar-nav"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </Navbar.Toggle>
        </Container>
      </Navbar>

      {/* Sidebar Lateral */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Contenido Principal */}
      <main className="content-wrapper">
        <Routes>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="crear-proceso" element={<CreateProcess />} />
          <Route path="consultar-procesos" element={<ConsultProcess />} />
          <Route path="proceso/:id" element={<ProcessDetail />} />
          <Route path="users" element={<Home />} />
          <Route path="users/new" element={<UsersNew />} />
          <Route path="users/:id/edit" element={<UsersEdit />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* Overlay para cerrar sidebar en móvil al hacer clic fuera */}
      {isSidebarOpen && (
        <div 
          className="sidebar-overlay" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}

function PublicRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-3">Cargando...</p>
      </div>
    );
  }
  
  if (isAuthenticated()) {
    return <Navigate to="/" replace />;
  }
  
  return children;
}

export default App;