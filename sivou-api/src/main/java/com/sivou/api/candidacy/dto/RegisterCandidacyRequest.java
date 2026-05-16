package com.sivou.api.candidacy.dto;

import com.sivou.api.candidacy.enums.CandidacyModality;
import com.sivou.api.candidacy.enums.SlateRole;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class RegisterCandidacyRequest {

    @NotNull(message = "La modalidad es obligatoria")
    private CandidacyModality modality;

    // Lista de miembros — para INDIVIDUAL solo uno con PRINCIPAL
    // Para PLANCHA: PRINCIPAL + ALTERNATE_1 + ALTERNATE_2
    @NotEmpty(message = "Debe incluir al menos un miembro")
    private List<CandidacyMemberRequest> members;

    @Data
    public static class CandidacyMemberRequest {
        @NotNull(message = "El ID del usuario es obligatorio")
        private String userId;

        @NotNull(message = "El rol en la plancha es obligatorio")
        private SlateRole roleInSlate;
    }
}
