import express from 'express';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from '../controllers/userController.js';

const router = express.Router();

// GET /api/users - Obtener todos los usuarios
router.get('/', getAllUsers);

// GET /api/users/:id - Obtener un usuario por ID
router.get('/:id', getUserById);

// POST /api/users - Crear un nuevo usuario
router.post('/', createUser);

// PUT /api/users/:id - Actualizar un usuario
router.put('/:id', updateUser);

// DELETE /api/users/:id - Eliminar un usuario
router.delete('/:id', deleteUser);

export default router;