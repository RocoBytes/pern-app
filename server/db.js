const { Pool } = require('pg');

// Configuración para Supabase
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:26292612Rockoo.@db.eqcsdzhuagtxdnjmcjiy.supabase.co:5432/postgres',
  ssl: {
    rejectUnauthorized: false // Necesario para Supabase
  },
  // Configuración adicional para producción
  max: 20, // Máximo número de clientes en el pool
  idleTimeoutMillis: 30000, // Cerrar clientes inactivos después de 30 segundos
  connectionTimeoutMillis: 2000, // Timeout de conexión de 2 segundos
});

// Test de conexión
pool.on('connect', (client) => {
  console.log('✅ Conectado a la base de datos Supabase');
});

pool.on('error', (err, client) => {
  console.error('❌ Error inesperado en el cliente de base de datos:', err);
  process.exit(-1);
});

// Función para verificar la conexión
const testConnection = async () => {
  try {
    const result = await pool.query('SELECT NOW()');
    console.log('🔌 Conexión a DB exitosa:', result.rows[0].now);
    return true;
  } catch (error) {
    console.error('❌ Error al conectar con la base de datos:', error.message);
    return false;
  }
};

// Ejecutar test al iniciar
testConnection();

module.exports = pool;