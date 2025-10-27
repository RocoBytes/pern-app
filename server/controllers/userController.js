const pool = require('../config/database');

// Obtener todos los usuarios
const getUsers = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM users');
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener usuarios', error });
    }
};

// Obtener un usuario por ID
const getUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el usuario', error });
    }
};

// Crear un nuevo usuario
const createUser = async (req, res) => {
    const { name, email } = req.body;
    try {
        const result = await pool.query('INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *', [name, email]);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el usuario', error });
    }
};

// Actualizar un usuario
const updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, email } = req.body;
    try {
        const result = await pool.query('UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *', [name, email, id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el usuario', error });
    }
};

// Eliminar un usuario
const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el usuario', error });
    }
};

module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
};