package com.sivou.api.election.dto;

import com.sivou.api.election.enums.ElectionStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateElectionStatusRequest {

    @NotNull(message = "El estado es obligatorio")
    private ElectionStatus status;
}