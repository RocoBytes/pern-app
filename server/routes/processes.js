const express = require('express');
const router = express.Router();
const pool = require('../db');
const { authenticateToken } = require('../middleware/auth');

// GET /api/processes - Obtener todos los procesos del usuario autenticado
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      'SELECT * FROM processes WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );

    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows,
    });
  } catch (error) {
    console.error('Error al obtener procesos:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener los procesos',
      error: error.message,
    });
  }
});

// GET /api/processes/:id - Obtener un proceso específico por ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const processId = req.params.id;
    const userId = req.user.id;

    // Buscar el proceso verificando que pertenezca al usuario autenticado
    const result = await pool.query(
      'SELECT * FROM processes WHERE id = $1 AND user_id = $2',
      [processId, userId]
    );

    // Si no se encuentra el proceso
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Proceso no encontrado o no tienes permiso para acceder a él',
      });
    }

    // Devolver el proceso encontrado
    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error al obtener el proceso:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener el proceso',
      error: error.message,
    });
  }
});

// POST /api/processes - Crear nuevo proceso
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { repertorio, caratula, cliente, email_cliente } = req.body;
    const userId = req.user.id;

    if (!repertorio) {
      return res.status(400).json({
        success: false,
        message: 'El repertorio es obligatorio',
      });
    }

    const result = await pool.query(
      'INSERT INTO processes (repertorio, caratula, cliente, email_cliente, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [repertorio, caratula, cliente, email_cliente, userId]
    );

    res.status(201).json({
      success: true,
      message: 'Proceso creado exitosamente',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error al crear proceso:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear el proceso',
      error: error.message,
    });
  }
});

// PUT /api/processes/:id/estado - Actualizar estado de un proceso
router.put('/:id/estado', authenticateToken, async (req, res) => {
  try {
    const processId = req.params.id;
    const { estado } = req.body;
    const userId = req.user.id;

    if (!estado) {
      return res.status(400).json({
        success: false,
        message: 'El estado es obligatorio',
      });
    }

    // Verificar que el proceso pertenece al usuario
    const checkResult = await pool.query(
      'SELECT * FROM processes WHERE id = $1 AND user_id = $2',
      [processId, userId]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Proceso no encontrado o no tienes permiso para modificarlo',
      });
    }

    // Actualizar el estado
    const result = await pool.query(
      'UPDATE processes SET estado = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 AND user_id = $3 RETURNING *',
      [estado, processId, userId]
    );

    res.json({
      success: true,
      message: 'Estado actualizado exitosamente',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error al actualizar estado:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar el estado',
      error: error.message,
    });
  }
});

// DELETE /api/processes/:id - Eliminar un proceso
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const processId = req.params.id;
    const userId = req.user.id;

    // Verificar que el proceso pertenece al usuario antes de eliminar
    const checkResult = await pool.query(
      'SELECT * FROM processes WHERE id = $1 AND user_id = $2',
      [processId, userId]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Proceso no encontrado o no tienes permiso para eliminarlo',
      });
    }

    // Eliminar el proceso
    await pool.query(
      'DELETE FROM processes WHERE id = $1 AND user_id = $2',
      [processId, userId]
    );

    res.json({
      success: true,
      message: 'Proceso eliminado exitosamente',
    });
  } catch (error) {
    console.error('Error al eliminar proceso:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar el proceso',
      error: error.message,
    });
  }
});

module.exports = router;