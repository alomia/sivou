package com.sivou.api.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class UserResponse {
    private String id;
    private String firstName;
    private String lastName;
    private String email;
    private String documentType;
    private String documentNumber;
    private boolean active;
    private List<String> roles;
}
