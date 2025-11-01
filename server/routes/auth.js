const express = require('express');
const router = express.Router();
const { loginLimiter } = require('../middleware/rateLimiter');

// Aplicar rate limiter al login
router.post('/login', loginLimiter, async (req, res) => {
  // ...existing code...
});

module.exports = router;