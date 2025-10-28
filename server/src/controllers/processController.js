import pool from '../db.js';

/**
 * GET /api/processes - Obtener todos los procesos
 */
export const getAllProcesses = async (req, res, next) => {
  try {
    const result = await pool.query(`
      SELECT 
        p.*,
        u.email as created_by_email
      FROM processes p
      LEFT JOIN users u ON p.user_id = u.id
      ORDER BY p.created_at DESC
    `);

    res.json({
      data: result.rows,
      count: result.rowCount,
      message: 'Processes retrieved successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/processes/:id - Obtener un proceso por ID
 */
export const getProcessById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await pool.query(`
      SELECT 
        p.*,
        u.email as created_by_email
      FROM processes p
      LEFT JOIN users u ON p.user_id = u.id
      WHERE p.id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Process not found',
        message: 'No process found with the provided ID',
      });
    }

    res.json({
      data: result.rows[0],
      message: 'Process retrieved successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/processes - Crear un nuevo proceso
 */
export const createProcess = async (req, res, next) => {
  try {
    const { repertorio, caratula, cliente, email_cliente, estado } = req.body;
    const userId = req.user.userId; // Del token JWT

    // Validar campos requeridos
    if (!repertorio) {
      return res.status(400).json({
        error: 'Validation error',
        message: 'Repertorio is required',
      });
    }

    const result = await pool.query(
      `INSERT INTO processes 
       (repertorio, caratula, cliente, email_cliente, estado, user_id) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING *`,
      [repertorio, caratula, cliente, email_cliente, estado || 'Iniciado', userId]
    );

    res.status(201).json({
      data: result.rows[0],
      message: 'Process created successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/processes/:id - Actualizar un proceso
 */
export const updateProcess = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { repertorio, caratula, cliente, email_cliente, estado } = req.body;

    const result = await pool.query(
      `UPDATE processes 
       SET repertorio = $1, 
           caratula = $2, 
           cliente = $3, 
           email_cliente = $4, 
           estado = $5
       WHERE id = $6 
       RETURNING *`,
      [repertorio, caratula, cliente, email_cliente, estado, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Process not found',
        message: 'No process found with the provided ID',
      });
    }

    res.json({
      data: result.rows[0],
      message: 'Process updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/processes/:id - Eliminar un proceso
 */
export const deleteProcess = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM processes WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Process not found',
        message: 'No process found with the provided ID',
      });
    }

    res.json({
      data: result.rows[0],
      message: 'Process deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};