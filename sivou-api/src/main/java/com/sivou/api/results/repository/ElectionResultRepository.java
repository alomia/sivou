package com.sivou.api.results.repository;

import com.sivou.api.results.entity.ElectionResult;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ElectionResultRepository extends JpaRepository<ElectionResult, String> {

    List<ElectionResult> findByElectionId(String electionId);

    boolean existsByElectionId(String electionId);

    void deleteByElectionId(String electionId);
}
