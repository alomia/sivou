package com.sivou.api.auth.controller;

import com.sivou.api.auth.dto.AuthResponse;
import com.sivou.api.auth.dto.ChangePasswordRequest;
import com.sivou.api.auth.dto.LoginRequest;
import com.sivou.api.auth.dto.RegisterRequest;
import com.sivou.api.auth.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.sivou.api.auth.dto.AssignRolesRequest;
import com.sivou.api.auth.dto.UserResponse;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
public class AuthController {

    private final AuthService service;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(service.login(request));
    }

    // Verifica token y devuelve datos del usuario autenticado
    // El frontend llama esto al recargar la página para restaurar la sesión
    @GetMapping("/me")
    public ResponseEntity<AuthResponse> me() {
        return ResponseEntity.ok(service.me());
    }

    @PutMapping("/change-password")
    public ResponseEntity<Void> changePassword(@Valid @RequestBody ChangePasswordRequest request) {
        service.changePassword(request);
        return ResponseEntity.noContent().build();
    }

    // Listar usuarios — solo ADMIN
    @GetMapping("/users")
    public ResponseEntity<List<UserResponse>> findAllUsers() {
        return ResponseEntity.ok(service.findAllUsers());
    }

    // Asignar roles a un usuario — solo ADMIN
    @PatchMapping("/users/{userId}/roles")
    public ResponseEntity<UserResponse> assignRoles(
            @PathVariable String userId,
            @Valid @RequestBody AssignRolesRequest request) {
        return ResponseEntity.ok(service.assignRoles(userId, request));
    }
}