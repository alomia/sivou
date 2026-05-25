-- Resultados consolidados por elección
-- HU-24: consolidar resultados al cierre
CREATE TABLE IF NOT EXISTS election_results
(
    id           VARCHAR(36)    NOT NULL PRIMARY KEY,
    election_id  VARCHAR(36)    NOT NULL,
    role_name    VARCHAR(50)    NOT NULL,
    candidacy_id VARCHAR(36),
    is_blank     BOOLEAN        NOT NULL DEFAULT FALSE,
    vote_count   INTEGER        NOT NULL DEFAULT 0,
    percentage   DECIMAL(5, 2)  NOT NULL DEFAULT 0.00,
    published_at TIMESTAMP(6),
    created_at   TIMESTAMP(6)   NOT NULL,
    CONSTRAINT fk_results_election  FOREIGN KEY (election_id)  REFERENCES elections (id),
    CONSTRAINT fk_results_candidacy FOREIGN KEY (candidacy_id) REFERENCES candidacies (id)
    );
