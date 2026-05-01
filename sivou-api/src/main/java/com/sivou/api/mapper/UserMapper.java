package com.sivou.api.mapper;

import com.sivou.api.dto.RegisterRequest;
import com.sivou.api.entity.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public User toEntity(RegisterRequest request, String encodedPassword) {
        User user = new User();
        user.setDocumentType(request.getDocumentType());
        user.setDocumentNumber(request.getDocumentNumber());
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setPasswordHash(encodedPassword);
        user.setActive(true);
        return user;
    }
}