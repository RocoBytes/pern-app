import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './components/Login';
import Dashboard from './pages/Dashboard';
import CreateProcess from './pages/CreateProcess';
import ConsultProcess from './pages/ConsultProcess';
import Home from './pages/Home';
import UsersNew from './pages/UsersNew';
import UsersEdit from './pages/UsersEdit';
import NotFound from './pages/NotFound';
import { useAuth } from './context/AuthContext';
import './App.css';

function App() {
  console.log('📱 App component rendering');

  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta pública (solo Login) */}
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        
        {/* Rutas protegidas con Sidebar */}
        <Route path="/*" element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

// Layout principal con Sidebar
function AppLayout() {
  return (
    <div className="app-wrapper">
      {/* Sidebar */}
      <Sidebar />

      {/* Contenido Principal */}
      <main className="content-wrapper">
        <Routes>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="crear-proceso" element={<CreateProcess />} />
          <Route path="consultar-procesos" element={<ConsultProcess />} />
          <Route path="users" element={<Home />} />
          <Route path="users/new" element={<UsersNew />} />
          <Route path="users/:id/edit" element={<UsersEdit />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}

// Componente para rutas públicas (redirige si ya está autenticado)
function PublicRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  
  console.log('🔓 PublicRoute - Loading:', loading, 'IsAuth:', isAuthenticated());
  
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
    console.log('🔓 Already authenticated, redirecting to dashboard');
    return <Navigate to="/" replace />;
  }
  
  return children;
}

export default App;