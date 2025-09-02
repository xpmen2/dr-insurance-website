DROP TABLE IF EXISTS users CASCADE;
DROP TYPE IF EXISTS user_type CASCADE;

CREATE TYPE user_type AS ENUM ('Administrador', 'Asistente', 'Agente');

-- Crear tabla de usuarios
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    tipo_usuario user_type NOT NULL DEFAULT 'Agente',
    autorizado BOOLEAN DEFAULT FALSE,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Índices para mejorar performance
    CONSTRAINT email_valid CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Crear índices para búsquedas frecuentes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_autorizado ON users(autorizado);
CREATE INDEX idx_users_tipo ON users(tipo_usuario);

-- Crear trigger para actualizar fecha_modificacion automáticamente
CREATE OR REPLACE FUNCTION update_fecha_modificacion()
RETURNS TRIGGER AS $$
BEGIN
    NEW.fecha_modificacion = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_fecha_modificacion
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_fecha_modificacion();

-- Insertar usuario administrador inicial (cambiar contraseña después)
-- Nota: El password_hash debe ser generado con bcrypt en la aplicación
-- Este es solo un placeholder, NO usar en producción
INSERT INTO users (
    nombre, 
    apellido, 
    telefono, 
    email, 
    password_hash, 
    tipo_usuario, 
    autorizado
) VALUES (
    'Admin',
    'Sistema',
    '8095551234',
    'admin@drinsurance.com',
    '$2b$10$YourHashedPasswordHere', -- CAMBIAR: Generar con bcrypt
    'Administrador',
    TRUE
);

-- Comentarios sobre el esquema
COMMENT ON TABLE users IS 'Tabla principal de usuarios del sistema DR Insurance';
COMMENT ON COLUMN users.autorizado IS 'Indica si el usuario ha sido autorizado por un administrador';
COMMENT ON COLUMN users.tipo_usuario IS 'Tipo de usuario: Administrador, Asistente o Agente';