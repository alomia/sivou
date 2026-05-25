package com.sivou.api.candidacy.dto;

import com.sivou.api.candidacy.enums.CandidacyStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ReviewCandidacyRequest {

    @NotNull(message = "La decisión es obligatoria")
    private CandidacyStatus status; // APPROVED | REJECTED

    // Obligatorio solo si status = REJECTED
    private String rejectReason;
}
