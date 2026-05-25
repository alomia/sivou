-- Insertar roles con IDs numéricos simples
INSERT INTO roles (name, description, created_at)
VALUES ('ROLE_ADMIN', 'Configuración global y gestión de integraciones', CURRENT_TIMESTAMP),
       ('ROLE_SEC_GRAL', 'Secretaría General: Gestión de elecciones', CURRENT_TIMESTAMP),
       ('ROLE_COMITE', 'Comité Electoral: Verificación y monitoreo', CURRENT_TIMESTAMP),
       ('ROLE_JURADO', 'Jurado: Validar identidad y votos', CURRENT_TIMESTAMP),
       ('ROLE_VEEDOR', 'Veedor: Consulta de indicadores', CURRENT_TIMESTAMP),
       ('ROLE_VOTANTE', 'Votante: Ejercer voto', CURRENT_TIMESTAMP),
       ('ROLE_CANDIDATO', 'Candidato: Carga de propuestas', CURRENT_TIMESTAMP);
