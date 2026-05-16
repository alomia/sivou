package com.sivou.api.election.entity;

import com.sivou.api.auth.entity.User;
import com.sivou.api.election.enums.ElectionStatus;
import com.sivou.api.election.enums.ElectionType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "elections")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Election {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ElectionType type;

    @Column(name = "organ_position", nullable = false)
    private String organPosition;

    @Column(name = "blank_vote", nullable = false)
    private boolean blankVote = true;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Column(name = "start_time", nullable = false)
    private LocalTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalTime endTime;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private ElectionStatus status = ElectionStatus.DRAFT;

    // Roles habilitados para votar (ROLE_VOTANTE, ROLE_ESTUDIANTE, etc.)
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(
            name = "election_allowed_roles",
            joinColumns = @JoinColumn(name = "election_id")
    )
    @Column(name = "role_name")
    @Builder.Default
    private Set<String> allowedRoles = new HashSet<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by", nullable = false)
    private User createdBy;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}