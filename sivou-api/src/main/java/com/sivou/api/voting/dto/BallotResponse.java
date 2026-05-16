package com.sivou.api.voting.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

// HU-14: tarjetón electoral
@Data
@AllArgsConstructor
public class BallotResponse {
    private String electionId;
    private String electionName;
    private boolean blankVoteEnabled;
    private List<BallotCandidacy> candidacies;

    @Data
    @AllArgsConstructor
    public static class BallotCandidacy {
        private String candidacyId;
        private String modality;       // INDIVIDUAL | PLANCHA
        private String principalName;  // nombre del candidato principal
        private String photoUrl;
        private String proposalPdfUrl;
    }
}
