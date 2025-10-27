import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../db.js';
import { authenticateToken } from '../middleware/authenticateToken.js';

const router = express.Router();

/**
 * POST /api/auth/register
 * Registrar un nuevo usuario
 */
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validar que los campos no estén vacíos
    if (!email || !password) {
      return res.status(400).json({
        error: 'Validation error',
        message: 'Email and password are required',
      });
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: 'Validation error',
        message: 'Invalid email format',
      });
    }

    // Validar longitud mínima de contraseña
    if (password.length < 6) {
      return res.status(400).json({
        error: 'Validation error',
        message: 'Password must be at least 6 characters long',
      });
    }

    // Generar salt y hashear la contraseña (10 rondas)
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Insertar el nuevo usuario en la base de datos
    const result = await pool.query(
      'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email, created_at',
      [email, password_hash]
    );

    const user = result.rows[0];

    // Generar token JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Devolver respuesta exitosa
    return res.status(201).json({
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
    // Manejar error de email duplicado (unique_violation)
    if (error.code === '23505') {
      console.log('⚠️  Duplicate email attempt:', req.body.email);
      return res.status(409).json({
        error: 'Duplicate email',
        message: 'Email already exists',
      });
    }

    // Error genérico - solo aquí mostramos el error completo
    console.error('❌ Register error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'An error occurred during registration',
    });
  }
});

/**
 * POST /api/auth/login
 * Iniciar sesión
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validar que los campos no estén vacíos
    if (!email || !password) {
      return res.status(400).json({
        error: 'Validation error',
        message: 'Email and password are required',
      });
    }

    // Buscar al usuario por email en la base de datos
    const result = await pool.query(
      'SELECT id, email, password_hash, created_at FROM users WHERE email = $1',
      [email]
    );

    // Si el usuario no existe, devolver 404
    if (result.rows.length === 0) {
      console.log('⚠️  Login attempt with non-existent email:', email);
      return res.status(404).json({
        error: 'User not found',
        message: 'No user found with this email',
      });
    }

    const user = result.rows[0];

    // Comparar la contraseña del req.body con el password_hash de la BD
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    // Si la contraseña es incorrecta, devolver 401
    if (!isPasswordValid) {
      console.log('⚠️  Invalid password attempt for email:', email);
      return res.status(401).json({
        error: 'Authentication failed',
        message: 'Invalid password',
      });
    }

    // Si la contraseña es correcta, generar token JWT que expire en 1h
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Devolver respuesta exitosa con el token
    res.status(200).json({
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
    console.error('Login error:', error);

    // Error genérico
    res.status(500).json({
      error: 'Internal server error',
      message: 'An error occurred during login',
    });
  }
});

/**
 * GET /api/auth/me
 * Obtener información del usuario autenticado (Ruta protegida)
 */
router.get('/me', authenticateToken, async (req, res) => {
  try {
    // req.user está disponible gracias al middleware authenticateToken
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

    return res.status(200).json({
      data: result.rows[0],
      message: 'User profile retrieved successfully',
    });
  } catch (error) {
    console.error('❌ Get profile error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'An error occurred while retrieving user profile',
    });
  }
});

/**
 * PUT /api/auth/change-password
 * Cambiar contraseña del usuario autenticado (Ruta protegida)
 */
router.put('/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Validaciones
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        error: 'Validation error',
        message: 'Current password and new password are required',
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        error: 'Validation error',
        message: 'New password must be at least 6 characters long',
      });
    }

    // Obtener usuario actual
    const userResult = await pool.query(
      'SELECT password_hash FROM users WHERE id = $1',
      [req.user.userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        error: 'User not found',
        message: 'User does not exist',
      });
    }

    const user = userResult.rows[0];

    // Verificar contraseña actual
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({
        error: 'Authentication failed',
        message: 'Current password is incorrect',
      });
    }

    // Hashear nueva contraseña
    const salt = await bcrypt.genSalt(10);
    const newPasswordHash = await bcrypt.hash(newPassword, salt);

    // Actualizar contraseña
    await pool.query(
      'UPDATE users SET password_hash = $1 WHERE id = $2',
      [newPasswordHash, req.user.userId]
    );

    return res.status(200).json({
      message: 'Password changed successfully',
    });
  } catch (error) {
    console.error('❌ Change password error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'An error occurred while changing password',
    });
  }
});

export default router;