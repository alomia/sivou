package com.sivou.api.voting.repository;

import com.sivou.api.voting.entity.Vote;
import com.sivou.api.voting.enums.VoteStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VoteRepository extends JpaRepository<Vote, String> {

    List<Vote> findByElectionId(String electionId);

    List<Vote> findByElectionIdAndStatus(String electionId, VoteStatus status);

    long countByElectionIdAndStatus(String electionId, VoteStatus status);
}
