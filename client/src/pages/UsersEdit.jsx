import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

function UsersEdit() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { token, logout } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUser();
  }, [id]);

  const fetchUser = async () => {
    try {
      setLoading(true);
      console.log('🔍 Fetching user:', id);

      const response = await axios.get(`${API_URL}/api/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('✅ User fetched:', response.data);
      setFormData({
        email: response.data.data.email,
        password: '', // No mostrar password existente
      });
    } catch (err) {
      console.error('❌ Error fetching user:', err);

      // Si el token expiró o es inválido, cerrar sesión
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        logout();
        return;
      }

      setError(err.response?.data?.message || 'Error loading user');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      console.log('✏️ Updating user:', id);
      await axios.put(`${API_URL}/api/users/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('✅ User updated successfully');
      navigate('/');
    } catch (err) {
      console.error('❌ Error updating user:', err);

      // Si el token expiró o es inválido, cerrar sesión
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        logout();
        return;
      }

      setError(err.response?.data?.message || 'Error updating user');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !formData.email) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p className="loading-text">Loading user...</p>
      </div>
    );
  }

  return (
    <div className="form-container">
      <h2>Edit User</h2>
      {error && <div className="error">{error}</div>}

      <form onSubmit={handleSubmit} className="user-form">
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password (leave empty to keep current):</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            minLength={6}
            placeholder="Enter new password or leave empty"
            disabled={loading}
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Updating...' : 'Update User'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="btn btn-secondary"
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default UsersEdit;