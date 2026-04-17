-- 1. Crear tabla de Roles
CREATE TABLE roles
(
    id          VARCHAR(36)  NOT NULL,
    name        VARCHAR(255) NOT NULL,
    description VARCHAR(255),
    updated_at  TIMESTAMP(6),
    created_at  TIMESTAMP(6) NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT uk_roles_name UNIQUE (name)
);

-- 2. Crear tabla de Usuarios
CREATE TABLE users
(
    id              VARCHAR(36)  NOT NULL,
    document_type   VARCHAR(255) NOT NULL,
    document_number VARCHAR(255) NOT NULL,
    first_name      VARCHAR(255) NOT NULL,
    last_name       VARCHAR(255) NOT NULL,
    email           VARCHAR(255) NOT NULL,
    password_hash   VARCHAR(255) NOT NULL,
    active          BOOLEAN      NOT NULL DEFAULT TRUE,
    updated_at      TIMESTAMP(6),
    created_at      TIMESTAMP(6) NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT uk_users_document_number UNIQUE (document_number),
    CONSTRAINT uk_users_email UNIQUE (email)
);

-- 3. Crear tabla intermedia para la relación Many-To-Many
CREATE TABLE user_roles
(
    user_id VARCHAR(36) NOT NULL,
    role_id VARCHAR(36) NOT NULL,
    PRIMARY KEY (user_id, role_id),
    CONSTRAINT fk_user_roles_user FOREIGN KEY (user_id) REFERENCES users (id),
    CONSTRAINT fk_user_roles_role FOREIGN KEY (role_id) REFERENCES roles (id)
);