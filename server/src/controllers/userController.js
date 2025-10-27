import pool from '../db.js';

// GET /api/users - Obtener todos los usuarios
export const getAllUsers = async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM users ORDER BY id ASC');
    res.json({
      data: result.rows,
      message: 'Users retrieved successfully',
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/users/:id - Obtener un usuario por ID
export const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'User not found',
        message: `User with id ${id} does not exist`,
      });
    }

    res.json({
      data: result.rows[0],
      message: 'User retrieved successfully',
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/users - Crear un nuevo usuario
export const createUser = async (req, res, next) => {
  try {
    const { name, email } = req.body;

    // Validar campos requeridos
    if (!name || !email) {
      return res.status(400).json({
        error: 'Validation error',
        message: 'Name and email are required',
      });
    }

    // Validar formato de email básico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: 'Validation error',
        message: 'Invalid email format',
      });
    }

    const result = await pool.query(
      'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *',
      [name, email]
    );

    res.status(201).json({
      data: result.rows[0],
      message: 'User created successfully',
    });
  } catch (error) {
    // Manejar error de email duplicado
    if (error.code === '23505') {
      return res.status(409).json({
        error: 'Duplicate email',
        message: 'Email already exists',
      });
    }
    next(error);
  }
};

// PUT /api/users/:id - Actualizar un usuario
export const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;

    // Validar campos requeridos
    if (!name || !email) {
      return res.status(400).json({
        error: 'Validation error',
        message: 'Name and email are required',
      });
    }

    // Validar formato de email básico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: 'Validation error',
        message: 'Invalid email format',
      });
    }

    const result = await pool.query(
      'UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *',
      [name, email, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'User not found',
        message: `User with id ${id} does not exist`,
      });
    }

    res.json({
      data: result.rows[0],
      message: 'User updated successfully',
    });
  } catch (error) {
    // Manejar error de email duplicado
    if (error.code === '23505') {
      return res.status(409).json({
        error: 'Duplicate email',
        message: 'Email already exists',
      });
    }
    next(error);
  }
};

// DELETE /api/users/:id - Eliminar un usuario
export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'User not found',
        message: `User with id ${id} does not exist`,
      });
    }

    res.json({
      data: result.rows[0],
      message: 'User deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};