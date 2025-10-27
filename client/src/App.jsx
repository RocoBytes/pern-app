import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './components/Login';
import Register from './components/Register';
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
        
        {/* Rutas protegidas con Outlet */}
        <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route path="/" element={<Home />} />
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
    console.log('🔓 Already authenticated, redirecting to home');
    return <Navigate to="/" replace />;
  }
  
  return children;
}

export default App;