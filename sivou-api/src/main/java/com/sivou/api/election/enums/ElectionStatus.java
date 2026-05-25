package com.sivou.api.election.enums;

public enum ElectionStatus {
    DRAFT,       // Borrador — solo visible para admin/sec_gral
    PUBLISHED,   // Publicada — visible para la comunidad, aún no abierta
    OPEN,        // Abierta — votación activa
    CLOSED,      // Cerrada — votación terminada, pendiente consolidación
    REPEATING,   // A repetir — voto en blanco >= 51%
    FINISHED     // Finalizada — resultados publicados
}
