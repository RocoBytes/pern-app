import express from 'express';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from '../controllers/userController.js';
import { authenticateToken } from '../middleware/authenticateToken.js';

const router = express.Router();

// GET /api/users - Obtener todos los usuarios (protegida)
router.get('/', authenticateToken, getAllUsers);

// GET /api/users/:id - Obtener un usuario por ID (protegida)
router.get('/:id', authenticateToken, getUserById);

// POST /api/users - Crear un nuevo usuario (protegida)
router.post('/', authenticateToken, createUser);

// PUT /api/users/:id - Actualizar un usuario (protegida)
router.put('/:id', authenticateToken, updateUser);

// DELETE /api/users/:id - Eliminar un usuario (protegida)
router.delete('/:id', authenticateToken, deleteUser);

export default router;