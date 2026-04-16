package com.sivou.api.controller;

import com.sivou.api.dto.AuthResponse;
import com.sivou.api.dto.RegisterRequest;
import com.sivou.api.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
public class AuthController {

    private final AuthService service;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = service.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}