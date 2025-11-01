require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const authRoutes = require('./routes/auth');
const processRoutes = require('./routes/processes');
const userRoutes = require('./routes/users');

const app = express();
const PORT = process.env.PORT || 4000;

// Seguridad
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS mejorado
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:4173',
  'https://pern-app-omega.vercel.app', // Tu dominio de Vercel
  process.env.FRONTEND_URL,
].filter(Boolean);

console.log('🌐 CORS - Orígenes permitidos:', allowedOrigins);

app.use(cors({
  origin: function(origin, callback) {
    // Permitir requests sin origin (Postman, curl, apps móviles)
    if (!origin) {
      console.log('✅ Request sin origin - permitido');
      return callback(null, true);
    }
    
    console.log('🔍 Verificando origin:', origin);
    
    if (allowedOrigins.includes(origin)) {
      console.log('✅ Origin permitido');
      callback(null, true);
    } else {
      console.log('❌ Origin bloqueado');
      callback(null, true); // Cambiado temporalmente para debug
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Preflight para todas las rutas
app.options('*', cors());

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log de requests
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.path}`);
  next();
});

// Rutas
app.get('/', (req, res) => {
  res.json({ 
    success: true, 
    message: 'API Notaría 2.0 funcionando',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    cors: allowedOrigins
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/processes', processRoutes);
app.use('/api/users', userRoutes);

// 404
app.use((req, res) => {
  console.log('❌ 404:', req.path);
  res.status(404).json({ 
    success: false, 
    message: 'Ruta no encontrada',
    path: req.path
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('💥 Error:', err.message);
  res.status(500).json({ 
    success: false, 
    message: process.env.NODE_ENV === 'production' 
      ? 'Error interno del servidor' 
      : err.message 
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`📍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 URL: https://pern-app-3crm.onrender.com`);
});