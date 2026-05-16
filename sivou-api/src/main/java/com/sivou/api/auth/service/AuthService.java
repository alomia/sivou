package com.sivou.api.auth.service;

import java.util.Set;
import com.sivou.api.auth.dto.*;
import com.sivou.api.auth.entity.Role;
import com.sivou.api.auth.entity.User;
import com.sivou.api.auth.enums.RoleName;
import com.sivou.api.auth.mapper.UserMapper;
import com.sivou.api.auth.repository.RoleRepository;
import com.sivou.api.auth.repository.UserRepository;
import com.sivou.api.shared.exception.ConflictException;
import com.sivou.api.shared.exception.NotFoundException;
import com.sivou.api.shared.exception.UnauthorizedException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ConflictException("El correo ya está registrado");
        }
        if (userRepository.existsByDocumentNumber(request.getDocumentNumber())) {
            throw new ConflictException("El número de documento ya está registrado");
        }

        Role votanteRole = roleRepository.findByName(RoleName.ROLE_VOTANTE)
                .orElseThrow(() -> new NotFoundException("Rol ROLE_VOTANTE no inicializado"));

        String encodedPassword = passwordEncoder.encode(request.getPassword());
        User user = userMapper.toEntity(request, encodedPassword);
        user.getRoles().add(votanteRole);
        userRepository.save(user);

        String token = jwtService.generateToken(user);
        return buildResponse(user, token);
    }

    public AuthResponse login(LoginRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
        } catch (BadCredentialsException ex) {
            throw new UnauthorizedException("Correo o contraseña incorrectos");
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UnauthorizedException("Correo o contraseña incorrectos"));

        String token = jwtService.generateToken(user);
        return buildResponse(user, token);
    }

    // Restaurar sesión desde token — usado por el frontend al recargar la página
    public AuthResponse me() {
        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UnauthorizedException("Sesión inválida"));

        String token = jwtService.generateToken(user);
        return buildResponse(user, token);
    }

    @Transactional
    public void changePassword(ChangePasswordRequest request) {
        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("Usuario no encontrado"));

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPasswordHash())) {
            throw new UnauthorizedException("La contraseña actual es incorrecta");
        }
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new ConflictException("Las contraseñas nuevas no coinciden");
        }

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    private AuthResponse buildResponse(User user, String token) {
        List<String> roles = user.getRoles().stream()
                .map(role -> role.getName().name())
                .toList();

        return new AuthResponse(
                token,
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                roles
        );
    }

    // Listar todos los usuarios — solo ADMIN
    public List<UserResponse> findAllUsers() {
        return userRepository.findAll().stream()
                .map(u -> new UserResponse(
                        u.getId(),
                        u.getFirstName(),
                        u.getLastName(),
                        u.getEmail(),
                        u.getDocumentType(),
                        u.getDocumentNumber(),
                        u.isActive(),
                        u.getRoles().stream().map(r -> r.getName().name()).toList()
                ))
                .toList();
    }

    // Asignar roles a un usuario — solo ADMIN
    @Transactional
    public UserResponse assignRoles(String userId, AssignRolesRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("Usuario no encontrado"));

        Set<Role> newRoles = request.getRoles().stream()
                .map(roleName -> {
                    try {
                        RoleName rn = RoleName.valueOf(roleName);
                        return roleRepository.findByName(rn)
                                .orElseThrow(() -> new NotFoundException("Rol no encontrado: " + roleName));
                    } catch (IllegalArgumentException e) {
                        throw new ConflictException("Rol inválido: " + roleName +
                                ". Válidos: ROLE_ADMIN, ROLE_SEC_GRAL, ROLE_COMITE, ROLE_JURADO, ROLE_VEEDOR, ROLE_VOTANTE, ROLE_CANDIDATO");
                    }
                })
                .collect(java.util.stream.Collectors.toSet());

        user.setRoles(newRoles);
        userRepository.save(user);

        return new UserResponse(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getDocumentType(),
                user.getDocumentNumber(),
                user.isActive(),
                user.getRoles().stream().map(r -> r.getName().name()).toList()
        );
    }
}