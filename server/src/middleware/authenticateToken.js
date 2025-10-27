import jwt from 'jsonwebtoken';

/**
 * Middleware para autenticar y verificar JWT token
 * Protege rutas que requieren autenticación
 */
export const authenticateToken = (req, res, next) => {
  try {
    // Obtener el header de autorización
    const authHeader = req.headers['authorization'];
    
    // Extraer el token (formato: "Bearer TOKEN")
    const token = authHeader && authHeader.split(' ')[1];

    // Si no hay token, devolver 401 (No autorizado)
    if (!token) {
      return res.status(401).json({
        error: 'Access denied',
        message: 'No token provided',
      });
    }

    // Verificar el token usando JWT_SECRET
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Adjuntar el payload del usuario al request
    req.user = decoded;

    // Continuar con la siguiente función
    next();
  } catch (error) {
    // Manejar diferentes tipos de errores de JWT
    if (error.name === 'TokenExpiredError') {
      return res.status(403).json({
        error: 'Token expired',
        message: 'Your session has expired. Please login again',
      });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(403).json({
        error: 'Invalid token',
        message: 'The provided token is invalid',
      });
    }

    // Error genérico
    return res.status(403).json({
      error: 'Authentication failed',
      message: 'Token verification failed',
    });
  }
};