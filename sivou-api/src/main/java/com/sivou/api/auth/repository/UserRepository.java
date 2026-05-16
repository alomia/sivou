package com.sivou.api.auth.repository;

import com.sivou.api.auth.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    Optional<User> findByEmail(String email);
    Optional<User> findByDocumentNumber(String documentNumber);
    boolean existsByEmail(String email);
    boolean existsByDocumentNumber(String documentNumber);
}
