-- Tabla principal de elecciones
CREATE TABLE IF NOT EXISTS elections
(
    id              VARCHAR(36)  NOT NULL PRIMARY KEY,
    name            VARCHAR(200) NOT NULL,
    description     TEXT,
    type            VARCHAR(50)  NOT NULL, -- ESTAMENTARIA | CONFIGURABLE
    organ_position  VARCHAR(200) NOT NULL, -- Consejo Directivo, Consejo Académico, etc.
    blank_vote      BOOLEAN      NOT NULL DEFAULT TRUE,
    start_date      DATE         NOT NULL,
    end_date        DATE         NOT NULL,
    start_time      TIME         NOT NULL,
    end_time        TIME         NOT NULL,
    status          VARCHAR(30)  NOT NULL DEFAULT 'DRAFT',
    -- DRAFT | PUBLISHED | OPEN | CLOSED | REPEATING | FINISHED
    created_by      VARCHAR(36)  NOT NULL,
    updated_at      TIMESTAMP(6),
    created_at      TIMESTAMP(6) NOT NULL,
    CONSTRAINT fk_elections_created_by FOREIGN KEY (created_by) REFERENCES users (id)
    );

-- Roles habilitados para votar en cada elección (padrón)
CREATE TABLE IF NOT EXISTS election_allowed_roles
(
    election_id VARCHAR(36) NOT NULL,
    role_name   VARCHAR(50) NOT NULL,
    PRIMARY KEY (election_id, role_name),
    CONSTRAINT fk_election_roles_election FOREIGN KEY (election_id) REFERENCES elections (id) ON DELETE CASCADE
    );
