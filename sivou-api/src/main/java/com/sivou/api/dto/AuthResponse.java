package com.sivou.api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String id;
    private String firstName;
    private String lastName;
    private String email;
}
