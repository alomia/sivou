package com.sivou.api.candidacy.mapper;

import com.sivou.api.candidacy.dto.CandidacyResponse;
import com.sivou.api.candidacy.entity.Candidacy;
import com.sivou.api.candidacy.entity.CandidacyMedia;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class CandidacyMapper {

    public CandidacyResponse toResponse(Candidacy candidacy) {
        CandidacyMedia media = candidacy.getMedia();

        List<CandidacyResponse.MemberResponse> members = candidacy.getMembers().stream()
                .map(m -> new CandidacyResponse.MemberResponse(
                        m.getUser().getId(),
                        m.getUser().getFirstName() + " " + m.getUser().getLastName(),
                        m.getUser().getEmail(),
                        m.getRoleInSlate()
                ))
                .toList();

        return new CandidacyResponse(
                candidacy.getId(),
                candidacy.getElection().getId(),
                candidacy.getElection().getName(),
                candidacy.getModality(),
                candidacy.getStatus(),
                candidacy.getRejectReason(),
                members,
                media != null ? media.getPhotoUrl() : null,
                media != null ? media.getProposalPdfUrl() : null,
                candidacy.getCreatedAt(),
                candidacy.getUpdatedAt()
        );
    }
}
