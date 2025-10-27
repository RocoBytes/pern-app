import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

/**
 * Hashear password con bcryptjs
 * @param {string} password - Password en texto plano
 * @returns {Promise<string>} Password hasheado
 */
export const hashPassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

/**
 * Comparar password con hash
 * @param {string} password - Password en texto plano
 * @param {string} hashedPassword - Password hasheado
 * @returns {Promise<boolean>} True si coinciden
 */
export const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

/**
 * Generar JWT token
 * @param {object} payload - Datos a incluir en el token
 * @returns {string} Token generado
 */
export const generateToken = (payload) => {
  return jwt.sign(
    payload,
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  );
};

/**
 * Verificar JWT token
 * @param {string} token - Token a verificar
 * @returns {object} Payload decodificado
 */
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};