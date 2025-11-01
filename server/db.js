const { Pool } = require('pg');

// Parsear la URL de Supabase para extraer componentes
const parseConnectionString = (connectionString) => {
  // postgresql://postgres:PASSWORD@HOST:5432/postgres
  const regex = /postgresql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/;
  const match = connectionString.match(regex);
  
  if (!match) {
    throw new Error('Formato de DATABASE_URL inválido');
  }

  return {
    user: match[1],
    password: match[2],
    host: match[3],
    port: parseInt(match[4]),
    database: match[5],
  };
};

// Configuración del pool
let poolConfig;

if (process.env.DATABASE_URL) {
  const dbConfig = parseConnectionString(process.env.DATABASE_URL);
  
  poolConfig = {
    user: dbConfig.user,
    password: dbConfig.password,
    host: dbConfig.host,
    port: dbConfig.port,
    database: dbConfig.database,
    ssl: {
      rejectUnauthorized: false
    },
    // Forzar IPv4
    family: 4,
    // Configuración de pool optimizada
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
    // Configuración para producción
    statement_timeout: 30000,
    query_timeout: 30000,
  };
} else {
  // Configuración por defecto para desarrollo local
  poolConfig = {
    user: 'postgres',
    host: 'localhost',
    database: 'notaria_db',
    password: 'postgres',
    port: 5432,
  };
}

console.log('🔌 Configurando conexión a base de datos...');
console.log('📍 Host:', poolConfig.host);
console.log('📍 Database:', poolConfig.database);
console.log('📍 User:', poolConfig.user);
console.log('📍 Port:', poolConfig.port);
console.log('📍 SSL:', poolConfig.ssl ? 'Habilitado' : 'Deshabilitado');
console.log('📍 IPv:', poolConfig.family === 4 ? 'IPv4' : 'IPv6/Auto');

const pool = new Pool(poolConfig);

// Test de conexión
pool.on('connect', (client) => {
  console.log('✅ Cliente conectado a la base de datos');
});

pool.on('error', (err, client) => {
  console.error('❌ Error inesperado en el cliente de base de datos:', err);
  console.error('Stack trace:', err.stack);
});

// Función para verificar la conexión
const testConnection = async () => {
  let client;
  try {
    console.log('🔄 Probando conexión a la base de datos...');
    client = await pool.connect();
    const result = await client.query('SELECT NOW() as now, version() as version');
    console.log('✅ Conexión a DB exitosa');
    console.log('⏰ Hora del servidor:', result.rows[0].now);
    console.log('📊 Versión PostgreSQL:', result.rows[0].version.split(',')[0]);
    return true;
  } catch (error) {
    console.error('❌ Error al conectar con la base de datos:', error.message);
    console.error('🔍 Código de error:', error.code);
    console.error('🔍 Detalles:', error.stack);
    return false;
  } finally {
    if (client) {
      client.release();
      console.log('🔓 Cliente liberado');
    }
  }
};

// Ejecutar test al iniciar
testConnection();

// Exportar pool y función de test
module.exports = pool;
module.exports.testConnection = testConnection;