package com.sivou.api.election.mapper;

import com.sivou.api.auth.entity.User;
import com.sivou.api.election.dto.CreateElectionRequest;
import com.sivou.api.election.dto.ElectionResponse;
import com.sivou.api.election.entity.Election;
import org.springframework.stereotype.Component;

@Component
public class ElectionMapper {

    public Election toEntity(CreateElectionRequest request, User createdBy) {
        return Election.builder()
                .name(request.getName())
                .description(request.getDescription())
                .type(request.getType())
                .organPosition(request.getOrganPosition())
                .blankVote(request.isBlankVote())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .allowedRoles(request.getAllowedRoles())
                .createdBy(createdBy)
                .build();
    }

    public ElectionResponse toResponse(Election election) {
        return new ElectionResponse(
                election.getId(),
                election.getName(),
                election.getDescription(),
                election.getType(),
                election.getOrganPosition(),
                election.isBlankVote(),
                election.getStartDate(),
                election.getEndDate(),
                election.getStartTime(),
                election.getEndTime(),
                election.getStatus(),
                election.getAllowedRoles(),
                election.getCreatedBy().getId(),
                election.getCreatedBy().getFirstName() + " " + election.getCreatedBy().getLastName(),
                election.getCreatedAt(),
                election.getUpdatedAt()
        );
    }
}
