-- 1. Crear tabla de Roles
CREATE TABLE IF NOT EXISTS roles
(
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name        VARCHAR(50)  NOT NULL,
    description VARCHAR(255),
    updated_at  TIMESTAMP(6),
    created_at  TIMESTAMP(6) NOT NULL,
    CONSTRAINT uk_roles_name UNIQUE (name)
    );

-- 2. Crear tabla de Usuarios
CREATE TABLE IF NOT EXISTS users
(
    id              VARCHAR(36)  NOT NULL PRIMARY KEY,
    document_type   VARCHAR(20)  NOT NULL,
    document_number VARCHAR(50)  NOT NULL,
    first_name      VARCHAR(100) NOT NULL,
    last_name       VARCHAR(100) NOT NULL,
    email           VARCHAR(150) NOT NULL,
    password_hash   VARCHAR(255) NOT NULL,
    active          BOOLEAN      NOT NULL DEFAULT TRUE,
    updated_at      TIMESTAMP(6),
    created_at      TIMESTAMP(6) NOT NULL,
    CONSTRAINT uk_users_document_number UNIQUE (document_number),
    CONSTRAINT uk_users_email UNIQUE (email)
    );

-- 3. Tabla intermedia (Muchos a Muchos)
CREATE TABLE IF NOT EXISTS user_roles
(
    user_id VARCHAR(36) NOT NULL,
    role_id BIGINT      NOT NULL,
    PRIMARY KEY (user_id, role_id),
    CONSTRAINT fk_user_roles_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_user_roles_role FOREIGN KEY (role_id) REFERENCES roles (id) ON DELETE CASCADE
    );
