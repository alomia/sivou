-- Tabla principal de candidaturas
CREATE TABLE IF NOT EXISTS candidacies
(
    id            VARCHAR(36) NOT NULL PRIMARY KEY,
    election_id   VARCHAR(36) NOT NULL,
    modality      VARCHAR(20) NOT NULL, -- INDIVIDUAL | PLANCHA
    status        VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    -- PENDING | APPROVED | REJECTED
    reject_reason TEXT,
    updated_at    TIMESTAMP(6),
    created_at    TIMESTAMP(6) NOT NULL,
    CONSTRAINT fk_candidacies_election FOREIGN KEY (election_id) REFERENCES elections (id) ON DELETE CASCADE
    );

-- Miembros de la candidatura (principal + suplentes si es plancha)
CREATE TABLE IF NOT EXISTS candidacy_members
(
    id            VARCHAR(36) NOT NULL PRIMARY KEY,
    candidacy_id  VARCHAR(36) NOT NULL,
    user_id       VARCHAR(36) NOT NULL,
    role_in_slate VARCHAR(20) NOT NULL, -- PRINCIPAL | ALTERNATE_1 | ALTERNATE_2
    updated_at    TIMESTAMP(6),
    created_at    TIMESTAMP(6) NOT NULL,
    CONSTRAINT fk_candidacy_members_candidacy FOREIGN KEY (candidacy_id) REFERENCES candidacies (id) ON DELETE CASCADE,
    CONSTRAINT fk_candidacy_members_user FOREIGN KEY (user_id) REFERENCES users (id)
    );

-- Archivos de la candidatura (foto tarjetón + propuesta PDF)
CREATE TABLE IF NOT EXISTS candidacy_media
(
    id               VARCHAR(36)  NOT NULL PRIMARY KEY,
    candidacy_id     VARCHAR(36)  NOT NULL,
    photo_url        VARCHAR(500),
    proposal_pdf_url VARCHAR(500),
    updated_at       TIMESTAMP(6),
    created_at       TIMESTAMP(6) NOT NULL,
    CONSTRAINT fk_candidacy_media_candidacy FOREIGN KEY (candidacy_id) REFERENCES candidacies (id) ON DELETE CASCADE
    );
