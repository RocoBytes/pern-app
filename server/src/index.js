import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
import processRoutes from './routes/processRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

// Cargar variables de entorno
dotenv.config();

// Validar variables de entorno críticas
if (!process.env.JWT_SECRET) {
  console.error('❌ FATAL ERROR: JWT_SECRET is not defined in .env file');
  process.exit(1);
}

if (!process.env.DATABASE_URL) {
  console.error('❌ FATAL ERROR: DATABASE_URL is not defined in .env file');
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 4000;

// Middlewares
app.use(helmet()); // Seguridad HTTP headers
app.use(cors()); // Permitir CORS
app.use(morgan('dev')); // Logging
app.use(express.json()); // Parsear JSON

// Ruta de health check
app.get('/api/health', (req, res) => {
  res.json({ ok: true, message: 'Server is running' });
});

// Rutas de autenticación
app.use('/api/auth', authRoutes);

// Rutas de usuarios
app.use('/api/users', userRoutes);

// Rutas de procesos
app.use('/api/processes', processRoutes);

// Middleware de manejo de errores (debe ir al final)
app.use(errorHandler);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔐 JWT_SECRET is configured: ${process.env.JWT_SECRET ? '✅' : '❌'}`);
});