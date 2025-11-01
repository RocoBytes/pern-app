const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcrypt = require('bcrypt');
const { authenticateToken } = require('../middleware/auth');

/**
 * GET /api/users
 * Obtener todos los usuarios (requiere autenticación)
 */
router.get('/', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, email, name, created_at, updated_at FROM users ORDER BY created_at DESC'
    );

    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows,
    });
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener los usuarios',
      error: error.message,
    });
  }
});

/**
 * GET /api/users/:id
 * Obtener un usuario específico por ID
 */
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'SELECT id, email, name, created_at, updated_at FROM users WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado',
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener el usuario',
      error: error.message,
    });
  }
});

/**
 * POST /api/users
 * Crear un nuevo usuario (registro)
 */
router.post('/', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Validaciones
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email y contraseña son obligatorios',
      });
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Formato de email inválido',
      });
    }

    // Validar longitud de contraseña
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'La contraseña debe tener al menos 6 caracteres',
      });
    }

    // Verificar si el usuario ya existe
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'El email ya está registrado',
      });
    }

    // Hashear la contraseña
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Crear el usuario
    const result = await pool.query(
      'INSERT INTO users (email, password, name) VALUES ($1, $2, $3) RETURNING id, email, name, created_at',
      [email, hashedPassword, name || null]
    );

    res.status(201).json({
      success: true,
      message: 'Usuario creado exitosamente',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error al crear usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear el usuario',
      error: error.message,
    });
  }
});

/**
 * PUT /api/users/:id
 * Actualizar un usuario existente
 */
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { email, name, password } = req.body;

    // Verificar que el usuario existe
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE id = $1',
      [id]
    );

    if (existingUser.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado',
      });
    }

    // Verificar que el usuario autenticado solo pueda actualizar su propio perfil
    // O implementar rol de administrador
    if (req.user.id !== id) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permiso para actualizar este usuario',
      });
    }

    // Construir query dinámicamente según los campos proporcionados
    let updateFields = [];
    let values = [];
    let valueIndex = 1;

    if (email) {
      // Validar formato de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: 'Formato de email inválido',
        });
      }

      // Verificar que el email no esté en uso por otro usuario
      const emailCheck = await pool.query(
        'SELECT id FROM users WHERE email = $1 AND id != $2',
        [email, id]
      );

      if (emailCheck.rows.length > 0) {
        return res.status(409).json({
          success: false,
          message: 'El email ya está en uso por otro usuario',
        });
      }

      updateFields.push(`email = $${valueIndex}`);
      values.push(email);
      valueIndex++;
    }

    if (name !== undefined) {
      updateFields.push(`name = $${valueIndex}`);
      values.push(name);
      valueIndex++;
    }

    if (password) {
      // Validar longitud de contraseña
      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'La contraseña debe tener al menos 6 caracteres',
        });
      }

      // Hashear la nueva contraseña
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      updateFields.push(`password = $${valueIndex}`);
      values.push(hashedPassword);
      valueIndex++;
    }

    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No se proporcionaron campos para actualizar',
      });
    }

    // Agregar updated_at
    updateFields.push(`updated_at = CURRENT_TIMESTAMP`);

    // Agregar el ID al final de los valores
    values.push(id);

    // Ejecutar la actualización
    const query = `
      UPDATE users 
      SET ${updateFields.join(', ')} 
      WHERE id = $${valueIndex} 
      RETURNING id, email, name, created_at, updated_at
    `;

    const result = await pool.query(query, values);

    res.json({
      success: true,
      message: 'Usuario actualizado exitosamente',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar el usuario',
      error: error.message,
    });
  }
});

/**
 * DELETE /api/users/:id
 * Eliminar un usuario
 */
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar que el usuario existe
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE id = $1',
      [id]
    );

    if (existingUser.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado',
      });
    }

    // Verificar que el usuario autenticado solo pueda eliminar su propio perfil
    // O implementar rol de administrador
    if (req.user.id !== id) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permiso para eliminar este usuario',
      });
    }

    // Verificar si el usuario tiene procesos asociados
    const processCount = await pool.query(
      'SELECT COUNT(*) FROM processes WHERE user_id = $1',
      [id]
    );

    if (parseInt(processCount.rows[0].count) > 0) {
      return res.status(409).json({
        success: false,
        message: `No se puede eliminar el usuario porque tiene ${processCount.rows[0].count} procesos asociados`,
      });
    }

    // Eliminar el usuario
    await pool.query('DELETE FROM users WHERE id = $1', [id]);

    res.json({
      success: true,
      message: 'Usuario eliminado exitosamente',
    });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar el usuario',
      error: error.message,
    });
  }
});

/**
 * GET /api/users/:id/processes
 * Obtener todos los procesos de un usuario específico
 */
router.get('/:id/processes', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar que el usuario autenticado solo pueda ver sus propios procesos
    // O implementar rol de administrador
    if (req.user.id !== id) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permiso para ver los procesos de este usuario',
      });
    }

    const result = await pool.query(
      'SELECT * FROM processes WHERE user_id = $1 ORDER BY created_at DESC',
      [id]
    );

    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows,
    });
  } catch (error) {
    console.error('Error al obtener procesos del usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener los procesos del usuario',
      error: error.message,
    });
  }
});

/**
 * GET /api/users/me
 * Obtener información del usuario autenticado
 */
router.get('/me/profile', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      'SELECT id, email, name, created_at, updated_at FROM users WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado',
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener el perfil del usuario',
      error: error.message,
    });
  }
});

module.exports = router;