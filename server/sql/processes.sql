-- =====================================================
-- SCRIPT: Crear tabla de procesos (processes)
-- Descripción: Gestión de procesos notariales con estados
-- =====================================================

-- 1. Crear tipo ENUM para estados del proceso
DROP TYPE IF EXISTS process_status CASCADE;
CREATE TYPE process_status AS ENUM (
    'Iniciado',
    'Vigente',
    'Terminado',
    'Reparado',
    'Pausado'
);

-- 2. Eliminar tabla si existe (solo para desarrollo)
DROP TABLE IF EXISTS processes CASCADE;

-- 3. Crear tabla processes
CREATE TABLE processes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    repertorio VARCHAR(255) NOT NULL,
    caratula VARCHAR(255),
    cliente VARCHAR(255),
    email_cliente VARCHAR(255),
    estado process_status DEFAULT 'Iniciado' NOT NULL,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW() NOT NULL,
    user_id UUID NOT NULL,
    
    -- Llave foránea que referencia a la tabla users
    CONSTRAINT fk_user
        FOREIGN KEY (user_id) 
        REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- 4. Crear índices para mejorar el rendimiento
CREATE INDEX idx_processes_user_id ON processes(user_id);
CREATE INDEX idx_processes_estado ON processes(estado);
CREATE INDEX idx_processes_repertorio ON processes(repertorio);
CREATE INDEX idx_processes_created_at ON processes(created_at DESC);

-- 5. Crear función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 6. Crear trigger que ejecuta la función antes de UPDATE
DROP TRIGGER IF EXISTS update_processes_updated_at ON processes;
CREATE TRIGGER update_processes_updated_at
    BEFORE UPDATE ON processes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 7. Insertar datos de prueba (opcional)
-- Primero asegúrate de tener al menos un usuario en la tabla users
INSERT INTO processes (repertorio, caratula, cliente, email_cliente, estado, user_id)
SELECT 
    'REP-2024-001',
    'Compraventa de Inmueble',
    'Juan Pérez',
    'juan.perez@example.com',
    'Iniciado',
    id
FROM users
LIMIT 1;

INSERT INTO processes (repertorio, caratula, cliente, email_cliente, estado, user_id)
SELECT 
    'REP-2024-002',
    'Constitución de Sociedad',
    'María González',
    'maria.gonzalez@example.com',
    'Vigente',
    id
FROM users
LIMIT 1;

INSERT INTO processes (repertorio, caratula, cliente, email_cliente, estado, user_id)
SELECT 
    'REP-2024-003',
    'Testamento',
    'Carlos Rodríguez',
    'carlos.rodriguez@example.com',
    'Terminado',
    id
FROM users
LIMIT 1;

-- 8. Verificar los datos insertados
SELECT 
    p.id,
    p.repertorio,
    p.caratula,
    p.cliente,
    p.estado,
    p.created_at,
    u.email as created_by
FROM processes p
INNER JOIN users u ON p.user_id = u.id
ORDER BY p.created_at DESC;

-- 9. Comentarios en las columnas (documentación)
COMMENT ON TABLE processes IS 'Tabla de procesos notariales';
COMMENT ON COLUMN processes.id IS 'Identificador único del proceso';
COMMENT ON COLUMN processes.repertorio IS 'Número de repertorio del proceso';
COMMENT ON COLUMN processes.caratula IS 'Descripción o título del proceso';
COMMENT ON COLUMN processes.cliente IS 'Nombre del cliente';
COMMENT ON COLUMN processes.email_cliente IS 'Email de contacto del cliente';
COMMENT ON COLUMN processes.estado IS 'Estado actual del proceso';
COMMENT ON COLUMN processes.user_id IS 'Usuario que creó el proceso';
COMMENT ON COLUMN processes.created_at IS 'Fecha de creación del proceso';
COMMENT ON COLUMN processes.updated_at IS 'Fecha de última actualización';