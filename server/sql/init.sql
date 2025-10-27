-- Crear la base de datos (ejecutar primero conectado a la BD 'postgres')
-- CREATE DATABASE pern_app;

-- Conectarse a pern_app y ejecutar lo siguiente:

-- Habilitar la extensión para UUID (si usas UUID)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Eliminar tabla si existe (para desarrollo)
DROP TABLE IF EXISTS users;

-- Crear tabla users con UUID
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Crear índice en email para búsquedas más rápidas
CREATE INDEX idx_users_email ON users(email);

-- Insertar datos de prueba (contraseña: "password123" hasheada con bcrypt)
-- Hash generado con bcrypt rounds=10
INSERT INTO users (email, password_hash) VALUES 
    ('juan@example.com', '$2b$10$rKvvHQCJlQlEZy2VPxMQKeFqT5PLXV1mXZjX5L3hR0HrZJV3.gXEK'),
    ('maria@example.com', '$2b$10$rKvvHQCJlQlEZy2VPxMQKeFqT5PLXV1mXZjX5L3hR0HrZJV3.gXEK'),
    ('carlos@example.com', '$2b$10$rKvvHQCJlQlEZy2VPxMQKeFqT5PLXV1mXZjX5L3hR0HrZJV3.gXEK');

-- Verificar los datos insertados
SELECT id, email, created_at FROM users;