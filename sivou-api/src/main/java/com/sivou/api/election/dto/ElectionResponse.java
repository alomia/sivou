package com.sivou.api.election.dto;

import com.sivou.api.election.enums.ElectionStatus;
import com.sivou.api.election.enums.ElectionType;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Set;

public record ElectionResponse(
        String id,
        String name,
        String description,
        ElectionType type,
        String organPosition,
        boolean blankVote,
        LocalDate startDate,
        LocalDate endDate,
        LocalTime startTime,
        LocalTime endTime,
        ElectionStatus status,
        Set<String> allowedRoles,
        String createdById,
        String createdByName,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {}
