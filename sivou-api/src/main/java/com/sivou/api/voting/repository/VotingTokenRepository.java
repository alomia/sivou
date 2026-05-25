package com.sivou.api.voting.repository;

import com.sivou.api.voting.entity.VotingToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface VotingTokenRepository extends JpaRepository<VotingToken, String> {

    // Busca si ya existe un token (haya votado o no) para esta combinación
    Optional<VotingToken> findByElectionIdAndUserIdAndRoleName(
            String electionId, String userId, String roleName);
}
