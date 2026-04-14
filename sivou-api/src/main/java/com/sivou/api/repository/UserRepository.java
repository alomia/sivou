package com.sivou.api.repository;

import com.sivou.api.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    Optional<User> findByEmail(String email);
    Optional<User> findByDocNumber(String docNumber);
    boolean existsByEmail(String email);
    boolean existsByDocNumber(String docNumber);
}
