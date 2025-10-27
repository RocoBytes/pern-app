import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

// Cargar variables de entorno
dotenv.config();

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

// Rutas de usuarios
app.use('/api/users', userRoutes);

// Middleware de manejo de errores (debe ir al final)
app.use(errorHandler);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});