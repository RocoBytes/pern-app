const { Pool } = require('pg');
const dns = require('dns');

// Forzar IPv4 globalmente
dns.setDefaultResultOrder('ipv4first');

// Configuración usando variables de entorno separadas
const poolConfig = {
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'notaria_db',
  
  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: false
  } : false,
  
  // FORZAR IPv4
  family: 4,
  
  // Pool config
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
  statement_timeout: 30000,
  query_timeout: 30000,
  application_name: 'notaria-backend'
};

console.log('🔌 Configurando Pool de PostgreSQL...');
console.log('📍 Host:', poolConfig.host);
console.log('📍 Database:', poolConfig.database);
console.log('📍 User:', poolConfig.user);
console.log('📍 Port:', poolConfig.port);
console.log('📍 SSL:', poolConfig.ssl ? 'Habilitado' : 'Deshabilitado');
console.log('📍 Environment:', process.env.NODE_ENV || 'development');

const pool = new Pool(poolConfig);

pool.on('connect', () => {
  console.log('✅ Cliente conectado al pool');
});

pool.on('error', (err) => {
  console.error('❌ Error en pool:', err.message);
});

// Test con reintentos
const testConnection = async (retries = 3) => {
  for (let i = 1; i <= retries; i++) {
    try {
      console.log(`🔄 Intento ${i}/${retries}...`);
      const client = await pool.connect();
      const result = await client.query('SELECT NOW(), version(), inet_server_addr()');
      client.release();
      
      console.log('✅ CONEXIÓN EXITOSA');
      console.log('⏰', result.rows[0].now);
      console.log('📊', result.rows[0].version.split(',')[0]);
      console.log('🌐 Server IP:', result.rows[0].inet_server_addr);
      return true;
    } catch (error) {
      console.error(`❌ Intento ${i} falló:`, error.message);
      if (i < retries) {
        await new Promise(r => setTimeout(r, i * 2000));
      }
    }
  }
  return false;
};

testConnection();

module.exports = pool;