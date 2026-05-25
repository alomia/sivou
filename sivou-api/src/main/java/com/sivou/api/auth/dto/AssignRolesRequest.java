package com.sivou.api.auth.dto;

import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

import java.util.Set;

@Data
public class AssignRolesRequest {

    @NotEmpty(message = "Debes indicar al menos un rol")
    private Set<String> roles;
}
