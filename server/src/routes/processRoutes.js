import express from 'express';
import pool from '../db.js';
import { authenticateToken } from '../middleware/authenticateToken.js';

const router = express.Router();

// Aplicar middleware de autenticación a todas las rutas
router.use(authenticateToken);

/**
 * POST /api/processes - Crear un nuevo proceso
 */
router.post('/', async (req, res) => {
  try {
    const { repertorio, caratula, cliente, email_cliente } = req.body;
    const user_id = req.user.userId; // Obtenido del token JWT

    // Validar campo requerido
    if (!repertorio) {
      return res.status(400).json({
        error: 'Validation error',
        message: 'Repertorio is required',
      });
    }

    // Insertar nuevo proceso en la base de datos
    // El estado por defecto será 'Iniciado' (manejado por la BD)
    const result = await pool.query(
      `INSERT INTO processes 
       (repertorio, caratula, cliente, email_cliente, user_id) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING *`,
      [repertorio, caratula, cliente, email_cliente, user_id]
    );

    console.log('✅ Process created by user:', req.user.email);

    return res.status(201).json({
      data: result.rows[0],
      message: 'Process created successfully',
    });
  } catch (error) {
    console.error('❌ Error creating process:', error);

    return res.status(500).json({
      error: 'Internal server error',
      message: 'An error occurred while creating the process',
    });
  }
});

/**
 * GET /api/processes - Obtener todos los procesos del usuario autenticado
 * EXCLUYE los procesos con estado 'Pausado'
 */
router.get('/', async (req, res) => {
  try {
    const user_id = req.user.userId; // Obtenido del token JWT

    // Consultar procesos del usuario, excluyendo los pausados
    const result = await pool.query(
      `SELECT 
        id,
        repertorio,
        caratula,
        cliente,
        email_cliente,
        estado,
        created_at,
        updated_at
       FROM processes 
       WHERE user_id = $1 AND estado != 'Pausado'
       ORDER BY created_at DESC`,
      [user_id]
    );

    console.log(`✅ Found ${result.rowCount} active processes for user:`, req.user.email);

    return res.status(200).json({
      data: result.rows,
      count: result.rowCount,
      message: 'Processes retrieved successfully',
    });
  } catch (error) {
    console.error('❌ Error fetching processes:', error);

    return res.status(500).json({
      error: 'Internal server error',
      message: 'An error occurred while fetching processes',
    });
  }
});

/**
 * PUT /api/processes/:id/estado - Actualizar el estado de un proceso
 * Solo el propietario del proceso puede editarlo
 */
router.put('/:id/estado', async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;
    const user_id = req.user.userId; // Obtenido del token JWT

    // Validar que el estado fue proporcionado
    if (!estado) {
      return res.status(400).json({
        error: 'Validation error',
        message: 'Estado is required',
      });
    }

    // Validar que el estado sea uno de los valores permitidos
    const validStates = ['Iniciado', 'Vigente', 'Terminado', 'Reparado', 'Pausado'];
    if (!validStates.includes(estado)) {
      return res.status(400).json({
        error: 'Validation error',
        message: `Estado must be one of: ${validStates.join(', ')}`,
      });
    }

    // Actualizar el estado del proceso
    // IMPORTANTE: WHERE doble para asegurar que solo el propietario pueda editar
    const result = await pool.query(
      `UPDATE processes 
       SET estado = $1, 
           updated_at = NOW()
       WHERE id = $2 AND user_id = $3
       RETURNING *`,
      [estado, id, user_id]
    );

    // Si no se encontró el proceso o no pertenece al usuario
    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Process not found',
        message: 'Process not found or you do not have permission to edit it',
      });
    }

    console.log(`✅ Process ${id} updated to '${estado}' by user:`, req.user.email);

    return res.status(200).json({
      data: result.rows[0],
      message: 'Process status updated successfully',
    });
  } catch (error) {
    console.error('❌ Error updating process:', error);

    // Manejar error si el estado no es un valor válido del ENUM
    if (error.code === '22P02') {
      return res.status(400).json({
        error: 'Invalid estado value',
        message: 'The provided estado is not valid',
      });
    }

    return res.status(500).json({
      error: 'Internal server error',
      message: 'An error occurred while updating the process',
    });
  }
});

/**
 * GET /api/processes/:id - Obtener un proceso específico por ID
 * Solo el propietario puede ver sus procesos
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.userId;

    const result = await pool.query(
      `SELECT * FROM processes 
       WHERE id = $1 AND user_id = $2`,
      [id, user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Process not found',
        message: 'Process not found or you do not have permission to view it',
      });
    }

    return res.status(200).json({
      data: result.rows[0],
      message: 'Process retrieved successfully',
    });
  } catch (error) {
    console.error('❌ Error fetching process:', error);

    return res.status(500).json({
      error: 'Internal server error',
      message: 'An error occurred while fetching the process',
    });
  }
});

/**
 * DELETE /api/processes/:id - Eliminar un proceso
 * Solo el propietario puede eliminar sus procesos
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.userId;

    const result = await pool.query(
      `DELETE FROM processes 
       WHERE id = $1 AND user_id = $2
       RETURNING *`,
      [id, user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Process not found',
        message: 'Process not found or you do not have permission to delete it',
      });
    }

    console.log(`🗑️  Process ${id} deleted by user:`, req.user.email);

    return res.status(200).json({
      data: result.rows[0],
      message: 'Process deleted successfully',
    });
  } catch (error) {
    console.error('❌ Error deleting process:', error);

    return res.status(500).json({
      error: 'Internal server error',
      message: 'An error occurred while deleting the process',
    });
  }
});

/**
 * GET /api/processes/paused/all - Obtener todos los procesos pausados
 * Solo del usuario autenticado
 */
router.get('/paused/all', async (req, res) => {
  try {
    const user_id = req.user.userId;

    const result = await pool.query(
      `SELECT * FROM processes 
       WHERE user_id = $1 AND estado = 'Pausado'
       ORDER BY updated_at DESC`,
      [user_id]
    );

    console.log(`✅ Found ${result.rowCount} paused processes for user:`, req.user.email);

    return res.status(200).json({
      data: result.rows,
      count: result.rowCount,
      message: 'Paused processes retrieved successfully',
    });
  } catch (error) {
    console.error('❌ Error fetching paused processes:', error);

    return res.status(500).json({
      error: 'Internal server error',
      message: 'An error occurred while fetching paused processes',
    });
  }
});

export default router;