package com.sivou.api.voting.dto;

import com.sivou.api.voting.enums.VoteStatus;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class VoteResponse {
    private String voteId;
    private String electionId;
    private String roleName;
    private boolean blankVote;
    private VoteStatus status;
    private LocalDateTime emittedAt;
    private String message;
}
