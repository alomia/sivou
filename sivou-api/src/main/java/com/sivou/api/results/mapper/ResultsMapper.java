package com.sivou.api.results.mapper;

import com.sivou.api.results.dto.ElectionResultResponse;
import com.sivou.api.results.entity.ElectionResult;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class ResultsMapper {

    public ElectionResultResponse toResponse(
            String electionId,
            String electionName,
            String electionStatus,
            int totalVotes,
            List<ElectionResult> results) {

        List<ElectionResultResponse.ResultRow> rows = results.stream()
                .map(r -> {
                    String candidacyId = r.getCandidacy() != null ? r.getCandidacy().getId() : null;
                    String candidateName = null;

                    if (r.getCandidacy() != null) {
                        candidateName = r.getCandidacy().getMembers().stream()
                                .filter(m -> m.getRoleInSlate().name().equals("PRINCIPAL"))
                                .findFirst()
                                .map(m -> m.getUser().getFirstName() + " " + m.getUser().getLastName())
                                .orElse("Sin nombre");
                    }

                    return new ElectionResultResponse.ResultRow(
                            candidacyId,
                            candidateName,
                            r.getRoleName(),
                            r.isBlank(),
                            r.getVoteCount(),
                            r.getPercentage()
                    );
                })
                .toList();

        return new ElectionResultResponse(
                electionId,
                electionName,
                electionStatus,
                results.isEmpty() ? null : results.get(0).getPublishedAt(),
                totalVotes,
                rows
        );
    }
}
