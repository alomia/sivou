package com.sivou.api.auth.dto;

import java.util.List;

public record AuthResponse(
        String token,
        String id,
        String firstName,
        String lastName,
        String email,
        List<String> roles
) {}