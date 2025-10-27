import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="loading-container">
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '4rem', color: '#e74c3c' }}>404</h1>
        <p style={{ fontSize: '1.5rem', color: '#7f8c8d' }}>Page not found</p>
        <Link to="/login" className="btn btn-primary" style={{ marginTop: '2rem' }}>
          Go to Login
        </Link>
      </div>
    </div>
  );
}

export default NotFound;