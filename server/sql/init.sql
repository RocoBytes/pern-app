-- Crear la base de datos (ejecutar primero conectado a la BD 'postgres')
-- CREATE DATABASE pern_app;

-- Conectarse a pern_app y ejecutar lo siguiente:

-- Eliminar tabla si existe (para desarrollo)
DROP TABLE IF EXISTS users;

-- Crear tabla users
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Insertar datos de prueba
INSERT INTO users (name, email) VALUES 
    ('Juan Pérez', 'juan@example.com'),
    ('María García', 'maria@example.com'),
    ('Carlos López', 'carlos@example.com');