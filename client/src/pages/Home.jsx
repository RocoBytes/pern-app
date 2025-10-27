import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

function Home() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/users`);
      setUsers(response.data.data);
      setError(null);
    } catch (err) {
      setError('Error loading users');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      await axios.delete(`${API_URL}/api/users/${id}`);
      fetchUsers();
    } catch (err) {
      alert('Error deleting user');
      console.error(err);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="home">
      <h2>Users List</h2>
      <table className="users-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
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
      {users.length === 0 && <p>No users found</p>}
    </div>
  );
}

export default Home;