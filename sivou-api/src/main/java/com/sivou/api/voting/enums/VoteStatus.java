package com.sivou.api.voting.enums;

public enum VoteStatus {
    PENDING,   // Emitido, esperando validación de jurado
    VALIDATED, // Aprobado por jurado — cuenta en resultados
    REJECTED   // Rechazado por jurado — no cuenta
}
