-- Usuario administrador por defecto del sistema
-- Email:    admin@sivou.com
-- Password: Admin1234*
INSERT INTO users (id, document_type, document_number, first_name, last_name, email, password_hash, active, created_at)
VALUES (
           'a0000000-0000-0000-0000-000000000001',
           'CC',
           '0000000000',
           'Admin',
           'SIVOU',
           'admin@uniajc.edu.co',
           '$2a$10$W4LRckJ0v7IyEe1oK2IO2ecL7kPjzVucly6KmzPvYqefXrLDNKFGO',
           true,
           CURRENT_TIMESTAMP
       );

-- Asignar rol ROLE_ADMIN al usuario admin
INSERT INTO user_roles (user_id, role_id)
SELECT 'a0000000-0000-0000-0000-000000000001', id
FROM roles
WHERE name = 'ROLE_ADMIN';
