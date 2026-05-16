package com.sivou.api.voting.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CastVoteRequest {

    // El rol con el que vota (ej: "ROLE_VOTANTE", "ROLE_ESTUDIANTE")
    @NotBlank(message = "El rol es obligatorio")
    private String roleName;

    // null si vota en blanco
    private String candidacyId;

    private boolean blankVote = false;
}
