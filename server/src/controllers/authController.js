import pool from '../db.js';
import { hashPassword, comparePassword, generateToken } from '../utils/auth.js';

/**
 * POST /api/auth/register - Registrar nuevo usuario
 */
export const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validar campos requeridos
    if (!email || !password) {
      return res.status(400).json({
        error: 'Validation error',
        message: 'Email and password are required',
      });
    }

    // Validar longitud de password
    if (password.length < 6) {
      return res.status(400).json({
        error: 'Validation error',
        message: 'Password must be at least 6 characters',
      });
    }

    // Hashear password
    const password_hash = await hashPassword(password);

    // Insertar usuario
    const result = await pool.query(
      'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email, created_at',
      [email, password_hash]
    );

    const user = result.rows[0];

    // Generar token
    const token = generateToken({ userId: user.id, email: user.email });

    res.status(201).json({
      data: {
        user: {
          id: user.id,
          email: user.email,
          created_at: user.created_at,
        },
        token,
      },
      message: 'User registered successfully',
    });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({
        error: 'Duplicate email',
        message: 'Email already exists',
      });
    }
    next(error);
  }
};

/**
 * POST /api/auth/login - Iniciar sesión
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validar campos requeridos
    if (!email || !password) {
      return res.status(400).json({
        error: 'Validation error',
        message: 'Email and password are required',
      });
    }

    // Buscar usuario
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        error: 'Authentication failed',
        message: 'Invalid credentials',
      });
    }

    const user = result.rows[0];

    // Verificar password
    const isMatch = await comparePassword(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({
        error: 'Authentication failed',
        message: 'Invalid credentials',
      });
    }

    // Generar token
    const token = generateToken({ userId: user.id, email: user.email });

    res.json({
      data: {
        user: {
          id: user.id,
          email: user.email,
          created_at: user.created_at,
        },
        token,
      },
      message: 'Login successful',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/auth/me - Obtener usuario autenticado
 */
export const getMe = async (req, res, next) => {
  try {
    const result = await pool.query(
      'SELECT id, email, created_at FROM users WHERE id = $1',
      [req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'User not found',
        message: 'User does not exist',
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