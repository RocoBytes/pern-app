const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const userService = {
  async getUsers(token) {
    try {
      const response = await fetch(`${API_URL}/api/users`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al obtener los usuarios');
      }

      return data;
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      throw error;
    }
  },

  async getUserById(id, token) {
    try {
      const response = await fetch(`${API_URL}/api/users/${id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al obtener el usuario');
      }

      return data;
    } catch (error) {
      console.error('Error al obtener usuario:', error);
      throw error;
    }
  },

  async createUser(userData, token) {
    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al crear el usuario');
      }

      return data;
    } catch (error) {
      console.error('Error al crear usuario:', error);
      throw error;
    }
  },

  async updateUser(id, userData, token) {
    try {
      const response = await fetch(`${API_URL}/api/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al actualizar el usuario');
      }

      return data;
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      throw error;
    }
  },

  async deleteUser(id, token) {
    try {
      const response = await fetch(`${API_URL}/api/users/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al eliminar el usuario');
      }

      return data;
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      throw error;
    }
  },
};

export default userService;