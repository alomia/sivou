package com.sivou.api.results.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
public class ElectionResultResponse {
    private String electionId;
    private String electionName;
    private String electionStatus;
    private LocalDateTime publishedAt;
    private int totalVotes;
    private List<ResultRow> results;

    @Data
    @AllArgsConstructor
    public static class ResultRow {
        private String candidacyId;   // null si es voto en blanco
        private String candidateName; // null si es voto en blanco
        private String roleName;
        private boolean blank;
        private int voteCount;
        private BigDecimal percentage;
    }
}
