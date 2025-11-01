const { Pool } = require('pg');

// Log de configuración
console.log('🔧 Inicializando configuración de base de datos...');
console.log('📍 NODE_ENV:', process.env.NODE_ENV);
console.log('📍 DB_HOST:', process.env.DB_HOST);
console.log('📍 DB_PORT:', process.env.DB_PORT);
console.log('📍 DB_USER:', process.env.DB_USER);
console.log('📍 DB_NAME:', process.env.DB_NAME);

// Configuración del pool
const poolConfig = {
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  database: process.env.DB_NAME || 'postgres',
  
  // SSL configuración
  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: false
  } : false,
  
  // Configuración de pool
  max: 10,
  min: 2,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
  
  // Configuración adicional
  application_name: 'notaria-backend',
  
  // IMPORTANTE: No usar family aquí, dejar que el pooler maneje la conexión
};

console.log('🔌 Configuración de Pool:');
console.log('   User:', poolConfig.user);
console.log('   Host:', poolConfig.host);
console.log('   Port:', poolConfig.port);
console.log('   Database:', poolConfig.database);
console.log('   SSL:', poolConfig.ssl ? 'Habilitado ✅' : 'Deshabilitado ❌');
console.log('   Max connections:', poolConfig.max);

// Crear pool
const pool = new Pool(poolConfig);

// Event handlers
pool.on('connect', (client) => {
  console.log('✅ Nuevo cliente conectado al pool');
});

pool.on('acquire', (client) => {
  console.log('🔓 Cliente adquirido del pool');
});

pool.on('error', (err, client) => {
  console.error('❌ Error inesperado en cliente del pool:');
  console.error('   Mensaje:', err.message);
  console.error('   Código:', err.code);
  console.error('   Stack:', err.stack);
});

pool.on('remove', (client) => {
  console.log('🗑️  Cliente removido del pool');
});

// Función de test mejorada
const testConnection = async () => {
  let client;
  const maxRetries = 5;
  const retryDelay = 3000; // 3 segundos
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`\n🔄 Intento ${attempt}/${maxRetries} - Conectando a Supabase...`);
      
      // Conectar con timeout
      client = await Promise.race([
        pool.connect(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout de conexión')), 10000)
        )
      ]);
      
      console.log('   📡 Cliente obtenido, ejecutando query de prueba...');
      
      // Query de prueba
      const result = await client.query(`
        SELECT 
          NOW() as current_time,
          version() as pg_version,
          current_database() as database,
          current_user as user_name,
          inet_server_addr() as server_ip
      `);
      
      const row = result.rows[0];
      
      console.log('\n✅ ¡CONEXIÓN EXITOSA A SUPABASE!');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('⏰ Hora servidor:', row.current_time);
      console.log('📊 PostgreSQL:', row.pg_version.split(' on ')[0]);
      console.log('🗄️  Database:', row.database);
      console.log('👤 Usuario:', row.user_name);
      console.log('🌐 IP servidor:', row.server_ip);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      
      return true;
      
    } catch (error) {
      console.error(`\n❌ Intento ${attempt} FALLÓ:`);
      console.error('   Error:', error.message);
      console.error('   Código:', error.code);
      
      if (error.message.includes('ENETUNREACH')) {
        console.error('   ⚠️  Error de red: No se puede alcanzar el servidor');
        console.error('   💡 Sugerencia: Verifica que estés usando el Connection Pooler');
      } else if (error.message.includes('timeout')) {
        console.error('   ⏱️  La conexión tardó demasiado');
      } else if (error.code === 'ENOTFOUND') {
        console.error('   🔍 No se pudo resolver el DNS del host');
      } else if (error.code === '28P01') {
        console.error('   🔐 Credenciales incorrectas');
      }
      
      if (attempt < maxRetries) {
        console.log(`   ⏳ Reintentando en ${retryDelay/1000} segundos...\n`);
        await new Promise(resolve => setTimeout(resolve, retryDelay));
      }
      
    } finally {
      if (client) {
        try {
          client.release();
          console.log('   🔓 Cliente liberado\n');
        } catch (releaseError) {
          console.error('   ⚠️  Error al liberar cliente:', releaseError.message);
        }
      }
    }
  }
  
  console.error('\n💥 ERROR CRÍTICO: No se pudo conectar a Supabase después de', maxRetries, 'intentos');
  console.error('🔧 Verifica la configuración de variables de entorno\n');
  return false;
};

// Ejecutar test al cargar el módulo
console.log('\n🚀 Iniciando test de conexión a base de datos...');
testConnection().catch(err => {
  console.error('💥 Error crítico en test inicial:', err);
});

// Exportar
module.exports = pool;
module.exports.testConnection = testConnection;