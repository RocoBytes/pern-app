const { body, param, validationResult } = require('express-validator');

const validateProcess = [
  body('repertorio')
    .trim()
    .notEmpty().withMessage('El repertorio es obligatorio')
    .isLength({ max: 50 }).withMessage('El repertorio no puede exceder 50 caracteres')
    .matches(/^[a-zA-Z0-9\-_]+$/).withMessage('El repertorio solo puede contener letras, números, guiones y guiones bajos'),
  
  body('caratula')
    .optional()
    .trim()
    .isLength({ max: 200 }).withMessage('La carátula no puede exceder 200 caracteres'),
  
  body('email_cliente')
    .optional()
    .trim()
    .isEmail().withMessage('Email inválido')
    .normalizeEmail(),
];

const validateLogin = [
  body('email')
    .trim()
    .notEmpty().withMessage('El email es obligatorio')
    .isEmail().withMessage('Email inválido')
    .normalizeEmail(),
  
  body('password')
    .notEmpty().withMessage('La contraseña es obligatoria')
    .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
];

const validateUUID = [
  param('id')
    .isUUID().withMessage('ID inválido'),
];

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Errores de validación',
      errors: errors.array(),
    });
  }
  next();
};

module.exports = {
  validateProcess,
  validateLogin,
  validateUUID,
  handleValidationErrors,
};