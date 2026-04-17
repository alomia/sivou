-- Insertar roles iniciales según apartado 10.3 del documento UNIAJC
INSERT INTO roles (id, name, description, created_at)
VALUES (random_uuid(), 'ROLE_ADMIN', 'Configuración global y gestión de integraciones', CURRENT_TIMESTAMP),
       (random_uuid(), 'ROLE_SEC_GRAL', 'Secretaría General: Gestión de elecciones, candidatos y resultados',
        CURRENT_TIMESTAMP),
       (random_uuid(), 'ROLE_COMITE', 'Comité Electoral: Verificación, actas y monitoreo', CURRENT_TIMESTAMP),
       (random_uuid(), 'ROLE_JURADO', 'Jurado: Validar identidad y votos asignados', CURRENT_TIMESTAMP),
       (random_uuid(), 'ROLE_VEEDOR', 'Veedor: Consulta de indicadores y reporte de irregularidades',
        CURRENT_TIMESTAMP),
       (random_uuid(), 'ROLE_VOTANTE', 'Votante: Ejercer voto según calidad habilitada', CURRENT_TIMESTAMP),
       (random_uuid(), 'ROLE_CANDIDATO', 'Candidato: Carga de propuestas y consulta de estado', CURRENT_TIMESTAMP);