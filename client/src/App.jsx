import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './pages/Dashboard';
import CreateProcess from './pages/CreateProcess';
import ConsultProcess from './pages/ConsultProcess';
import Home from './pages/Home';
import UsersNew from './pages/UsersNew';
import UsersEdit from './pages/UsersEdit';
import NotFound from './pages/NotFound';
import { useAuth } from './context/AuthContext';

function App() {
  console.log('📱 App component rendering');

  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
        
        {/* Rutas protegidas */}
        <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="crear-proceso" element={<CreateProcess />} />
          <Route path="consultar-procesos" element={<ConsultProcess />} />
          <Route path="users" element={<Home />} />
          <Route path="users/new" element={<UsersNew />} />
          <Route path="users/:id/edit" element={<UsersEdit />} />
        </Route>

        {/* Ruta 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

// Componente para rutas públicas (redirige si ya está autenticado)
function PublicRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  
  console.log('🔓 PublicRoute - Loading:', loading, 'IsAuth:', isAuthenticated());
  
  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p className="loading-text">Loading...</p>
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