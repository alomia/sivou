package com.sivou.api.voting.mapper;

import com.sivou.api.voting.dto.VoteResponse;
import com.sivou.api.voting.entity.Vote;
import org.springframework.stereotype.Component;

@Component
public class VoteMapper {

    public VoteResponse toResponse(Vote vote) {
        return new VoteResponse(
                vote.getId(),
                vote.getElection().getId(),
                vote.getRoleName(),
                vote.isBlankVote(),
                vote.getStatus(),
                vote.getEmittedAt(),
                "Tu voto ha sido registrado correctamente. Estado: " + vote.getStatus()
        );
    }
}
