package com.sivou.api.service;

import com.sivou.api.dto.AuthResponse;
import com.sivou.api.dto.ChangePasswordRequest;
import com.sivou.api.dto.LoginRequest; // Asegúrate de tener este DTO
import com.sivou.api.dto.RegisterRequest;
import com.sivou.api.entity.Role;
import com.sivou.api.entity.User;
import com.sivou.api.enums.RoleName;
import com.sivou.api.mapper.UserMapper;
import com.sivou.api.repository.RoleRepository;
import com.sivou.api.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService; // Inyectamos tu nuevo servicio
    private final AuthenticationManager authenticationManager; // Para validar el login

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email ya registrado");
        }

        if (userRepository.existsByDocumentNumber(request.getDocumentNumber())) {
            throw new RuntimeException("Documento ya registrado");
        }

        String encodedPassword = passwordEncoder.encode(request.getPassword());
        User user = userMapper.toEntity(request, encodedPassword);

        Role votanteRole = roleRepository.findByName(RoleName.ROLE_VOTANTE)
                .orElseThrow(() -> new RuntimeException("Error: El rol ROLE_VOTANTE no está inicializado"));

        user.getRoles().add(votanteRole);
        userRepository.save(user);

        // GENERAMOS EL TOKEN
        String token = jwtService.generateToken(user);

        return mapToResponse(user, token);
    }

    public AuthResponse login(LoginRequest request) {
        // Esto valida automáticamente si el email y password son correctos
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        // Si llegó aquí, el usuario es válido
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        String token = jwtService.generateToken(user);

        return mapToResponse(user, token);
    }

    // Método privado para no repetir código de mapeo
    private AuthResponse mapToResponse(User user, String token) {
        return new AuthResponse(
                token,
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail()
        );
    }

    public void changePassword(ChangePasswordRequest request) {

        // 1. Obtener el usuario autenticado del contexto de seguridad
        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // 2. Verificar que la contraseña actual es correcta
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPasswordHash())) {
            throw new RuntimeException("La contraseña actual es incorrecta");
        }

        // 3. Verificar que nueva contraseña y confirmación coinciden
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new RuntimeException("Las contraseñas no coinciden");
        }

        // 4. Guardar la nueva contraseña encriptada
        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }
}
