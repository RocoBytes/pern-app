-- =====================================================
-- SCRIPT: Crear tabla de procesos (PRODUCCIÓN)
-- =====================================================

-- Crear tipo ENUM para estados
CREATE TYPE process_status AS ENUM (
    'Iniciado',
    'Vigente',
    'Terminado',
    'Reparado',
    'Pausado'
);

-- Crear tabla processes
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
    
    CONSTRAINT fk_user
        FOREIGN KEY (user_id) 
        REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- Índices
CREATE INDEX idx_processes_user_id ON processes(user_id);
CREATE INDEX idx_processes_estado ON processes(estado);
CREATE INDEX idx_processes_repertorio ON processes(repertorio);
CREATE INDEX idx_processes_created_at ON processes(created_at DESC);

-- Función para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger
CREATE TRIGGER update_processes_updated_at
    BEFORE UPDATE ON processes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Ver todos los procesos con información del usuario
SELECT 
    p.id,
    p.repertorio,
    p.caratula,
    p.cliente,
    p.email_cliente,
    p.estado,
    p.created_at,
    p.updated_at,
    u.email as usuario_creador
FROM processes p
LEFT JOIN users u ON p.user_id = u.id
ORDER BY p.created_at DESC;

-- Contar procesos por estado
SELECT 
    estado,
    COUNT(*) as cantidad
FROM processes
GROUP BY estado
ORDER BY cantidad DESC;

-- Ver procesos de un usuario específico
SELECT * FROM processes 
WHERE user_id = 'tu-uuid-aqui'
ORDER BY created_at DESC;

-- Probar el trigger de updated_at
UPDATE processes 
SET caratula = 'Caratula Actualizada'
WHERE id = (SELECT id FROM processes LIMIT 1);

-- Verificar que updated_at cambió
SELECT id, caratula, created_at, updated_at 
FROM processes 
LIMIT 1;