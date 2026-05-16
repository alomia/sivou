package com.sivou.api.candidacy.dto;

import com.sivou.api.candidacy.enums.CandidacyModality;
import com.sivou.api.candidacy.enums.CandidacyStatus;
import com.sivou.api.candidacy.enums.SlateRole;

import java.time.LocalDateTime;
import java.util.List;

public record CandidacyResponse(
        String id,
        String electionId,
        String electionName,
        CandidacyModality modality,
        CandidacyStatus status,
        String rejectReason,
        List<MemberResponse> members,
        String photoUrl,
        String proposalPdfUrl,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public record MemberResponse(
            String userId,
            String fullName,
            String email,
            SlateRole roleInSlate
    ) {}
}
