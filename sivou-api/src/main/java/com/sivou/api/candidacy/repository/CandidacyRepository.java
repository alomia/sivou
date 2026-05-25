package com.sivou.api.candidacy.repository;

import com.sivou.api.candidacy.entity.Candidacy;
import com.sivou.api.candidacy.enums.CandidacyStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CandidacyRepository extends JpaRepository<Candidacy, String> {
    List<Candidacy> findByElectionId(String electionId);
    List<Candidacy> findByElectionIdAndStatus(String electionId, CandidacyStatus status);
}
