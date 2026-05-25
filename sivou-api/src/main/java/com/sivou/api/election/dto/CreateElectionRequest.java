package com.sivou.api.election.dto;

import com.sivou.api.election.enums.ElectionType;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Set;

@Data
public class CreateElectionRequest {

    @NotBlank(message = "El nombre de la elección es obligatorio")
    private String name;

    private String description;

    @NotNull(message = "El tipo de elección es obligatorio")
    private ElectionType type;

    @NotBlank(message = "El órgano o cargo es obligatorio")
    private String organPosition;

    // El voto en blanco siempre va a true por el Acuerdo 004
    // pero se puede configurar para elecciones no estamentarias
    private boolean blankVote = true;

    @NotNull(message = "La fecha de inicio es obligatoria")
    private LocalDate startDate;

    @NotNull(message = "La fecha de fin es obligatoria")
    private LocalDate endDate;

    @NotNull(message = "La hora de inicio es obligatoria")
    private LocalTime startTime;

    @NotNull(message = "La hora de fin es obligatoria")
    private LocalTime endTime;

    @NotEmpty(message = "Debe habilitar al menos un rol para votar")
    private Set<String> allowedRoles;
}
