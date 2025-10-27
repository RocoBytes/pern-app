import { verifyToken } from '../utils/auth.js';

/**
 * Middleware para proteger rutas con JWT
 */
export const authenticateToken = (req, res, next) => {
  try {
    // Obtener token del header Authorization
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        error: 'Access denied',
        message: 'No token provided',
      });
    }

    // Verificar token
    const decoded = verifyToken(token);
    req.user = decoded; // Agregar usuario al request
    next();
  } catch (error) {
    return res.status(403).json({
      error: 'Invalid token',
      message: error.message,
    });
  }
};

/**
 * Middleware opcional - permite acceso sin token pero agrega user si existe
 */
export const optionalAuth = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = verifyToken(token);
      req.user = decoded;
    }
    next();
  } catch (error) {
    next(); // Continuar sin usuario si el token es inválido
  }
};