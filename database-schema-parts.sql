-- PARTE 1: Crear el enum (ejecutar primero)
CREATE TYPE user_type AS ENUM ('Administrador', 'Asistente', 'Agente');

-- PARTE 2: Crear la tabla users (ejecutar segundo)
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
    fecha_modificacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- PARTE 3: Crear índices (ejecutar tercero)
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_autorizado ON users(autorizado);
CREATE INDEX idx_users_tipo ON users(tipo_usuario);

-- PARTE 4: Crear función y trigger (ejecutar cuarto)
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