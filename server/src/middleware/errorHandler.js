// Middleware centralizado para manejo de errores
export const errorHandler = (err, req, res, next) => {
  console.error('❌ Error:', err);

  // Error de PostgreSQL
  if (err.code) {
    return res.status(500).json({
      error: 'Database error',
      message: 'An error occurred while processing your request',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  }

  // Error genérico
  res.status(err.status || 500).json({
    error: err.name || 'Internal Server Error',
    message: err.message || 'An unexpected error occurred',
  });
};