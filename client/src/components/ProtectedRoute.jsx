import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children }) {
  const { token, user, loading } = useAuth();

  console.log('🔒 ProtectedRoute - Loading:', loading, 'Token:', !!token, 'User:', !!user);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p className="loading-text">Verifying authentication...</p>
      </div>
    );
  }

  if (!token || !user) {
    console.log('🔒 Not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  console.log('✅ Authenticated, rendering protected content');
  return children;
}

export default ProtectedRoute;