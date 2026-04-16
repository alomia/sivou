package com.sivou.api.service;

import com.sivou.api.dto.AuthResponse;
import com.sivou.api.dto.RegisterRequest;
import com.sivou.api.entity.User;
import com.sivou.api.mapper.UserMapper;
import com.sivou.api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    public AuthResponse register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email ya registrado");
        }

        if (userRepository.existsByDocumentNumber(request.getDocumentNumber())) {
            throw new RuntimeException("Documento ya registrado");
        }

        String encodedPassword = passwordEncoder.encode(request.getPassword());
        User user = userMapper.toEntity(request, encodedPassword);
        userRepository.save(user);

        return new AuthResponse(
                null,
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail()
        );
    }
}
