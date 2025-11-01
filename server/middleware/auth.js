const jwt = require('jsonwebtoken');

/**
 * Middleware para autenticar el token JWT
 */
const authenticateToken = (req, res, next) => {
  try {
    // Obtener el token del header Authorization
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token no proporcionado. Acceso denegado.',
      });
    }

    // Verificar el token
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({
          success: false,
          message: 'Token inválido o expirado.',
        });
      }

      // Guardar la información del usuario en req.user
      req.user = user;
      next();
    });
  } catch (error) {
    console.error('Error en authenticateToken:', error);
    res.status(500).json({
      success: false,
      message: 'Error al autenticar el token.',
    });
  }
};

module.exports = { authenticateToken };