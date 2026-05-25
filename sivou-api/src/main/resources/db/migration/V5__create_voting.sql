-- Control de unicidad: una persona vota una sola vez por elección
-- HU-13: impedir doble voto
CREATE TABLE IF NOT EXISTS voting_tokens
(
    id          VARCHAR(36)  NOT NULL PRIMARY KEY,
    election_id VARCHAR(36)  NOT NULL,
    user_id     VARCHAR(36)  NOT NULL,
    role_name   VARCHAR(50)  NOT NULL,
    used        BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at  TIMESTAMP(6) NOT NULL,
    CONSTRAINT fk_vt_election FOREIGN KEY (election_id) REFERENCES elections (id),
    CONSTRAINT fk_vt_user     FOREIGN KEY (user_id)     REFERENCES users (id),
    CONSTRAINT uq_vt_vote     UNIQUE (election_id, user_id, role_name)
    );

-- La urna: el voto real SIN referencia al usuario (secreto del voto)
-- HU-17: registrar estado del voto
CREATE TABLE IF NOT EXISTS votes
(
    id            VARCHAR(36)  NOT NULL PRIMARY KEY,
    election_id   VARCHAR(36)  NOT NULL,
    role_name     VARCHAR(50)  NOT NULL,
    candidacy_id  VARCHAR(36),
    is_blank_vote BOOLEAN      NOT NULL DEFAULT FALSE,
    status        VARCHAR(20)  NOT NULL DEFAULT 'PENDING',
    emitted_at    TIMESTAMP(6) NOT NULL,
    CONSTRAINT fk_votes_election  FOREIGN KEY (election_id)  REFERENCES elections (id),
    CONSTRAINT fk_votes_candidacy FOREIGN KEY (candidacy_id) REFERENCES candidacies (id)
    );
