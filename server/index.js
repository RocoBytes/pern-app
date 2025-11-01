require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const authRoutes = require('./routes/auth');
const processRoutes = require('./routes/processes');
const userRoutes = require('./routes/users');

const app = express();
const PORT = process.env.PORT || 4000;

console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('🚀 INICIANDO SERVIDOR NOTARÍA 2.0');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('📍 Environment:', process.env.NODE_ENV || 'development');
console.log('📍 Port:', PORT);
console.log('📍 Frontend URL:', process.env.FRONTEND_URL || 'No configurado');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

// Seguridad
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:4173',
  process.env.FRONTEND_URL,
].filter(Boolean);

console.log('🌐 CORS - Orígenes permitidos:', allowedOrigins);

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) {
      return callback(null, true);
    }
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      // En producción, permitir de todas formas para debug
      console.log('⚠️  Origin no listado pero permitido:', origin);
      callback(null, true);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.options('*', cors());

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path} - Origin: ${req.headers.origin || 'No origin'}`);
  next();
});

// Rutas
app.get('/', (req, res) => {
  res.json({ 
    success: true, 
    message: '⚖️ API Notaría 2.0 funcionando correctamente',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: '/api/auth',
      processes: '/api/processes',
      users: '/api/users'
    }
  });
});

// Health check
app.get('/health', async (req, res) => {
  const { testConnection } = require('./db');
  const dbOk = await testConnection();
  
  res.json({
    success: true,
    status: dbOk ? 'healthy' : 'degraded',
    database: dbOk ? 'connected' : 'disconnected',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/processes', processRoutes);
app.use('/api/users', userRoutes);

// 404
app.use((req, res) => {
  console.log('❌ 404 - Ruta no encontrada:', req.path);
  res.status(404).json({ 
    success: false, 
    message: 'Ruta no encontrada',
    path: req.path
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('💥 Error no manejado:');
  console.error('   Path:', req.path);
  console.error('   Error:', err.message);
  console.error('   Stack:', err.stack);
  
  res.status(500).json({ 
    success: false, 
    message: process.env.NODE_ENV === 'production' 
      ? 'Error interno del servidor' 
      : err.message 
  });
});

app.listen(PORT, () => {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('✅ SERVIDOR INICIADO CORRECTAMENTE');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🌐 URL:', `https://pern-app-3crm.onrender.com`);
  console.log('📍 Puerto:', PORT);
  console.log('⏰ Iniciado:', new Date().toISOString());
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
});