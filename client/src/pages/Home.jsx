import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

function Home() {
  const { token, logout } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔍 Fetching users with token:', token ? 'Present' : 'Missing');

      const response = await axios.get(`${API_URL}/api/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('✅ Users fetched:', response.data);
      setUsers(response.data.data);
    } catch (err) {
      console.error('❌ Error fetching users:', err);

      // Si el token expiró o es inválido, cerrar sesión
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        console.log('🔒 Token invalid, logging out');
        logout();
        return;
      }

      setError(err.response?.data?.message || 'Error loading users');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      console.log('🗑️ Deleting user:', id);
      await axios.delete(`${API_URL}/api/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('✅ User deleted');
      // Actualizar la lista después de eliminar
      setUsers(users.filter((user) => user.id !== id));
    } catch (err) {
      console.error('❌ Error deleting user:', err);

      // Si el token expiró o es inválido, cerrar sesión
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        logout();
        return;
      }

      alert(err.response?.data?.message || 'Error deleting user');
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p className="loading-text">Loading users...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="home">
        <h2>Users</h2>
        <div className="error" style={{ marginBottom: '1rem' }}>
          {error}
        </div>
        <button onClick={fetchUsers} className="btn btn-primary">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="home">
      <h2>Users</h2>
      <Link to="/users/new" className="btn btn-primary">
        Add New User
      </Link>

      {users.length === 0 ? (
        <p style={{ marginTop: '2rem', textAlign: 'center', color: '#7f8c8d' }}>
          No users found. Create your first user!
        </p>
      ) : (
        <table className="users-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Email</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.email}</td>
                <td>{new Date(user.created_at).toLocaleDateString()}</td>
                <td>
                  <Link to={`/users/${user.id}/edit`} className="btn btn-edit">
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="btn btn-delete"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Home;