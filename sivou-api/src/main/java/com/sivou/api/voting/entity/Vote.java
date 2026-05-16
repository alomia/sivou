package com.sivou.api.voting.entity;

import com.sivou.api.candidacy.entity.Candidacy;
import com.sivou.api.election.entity.Election;
import com.sivou.api.voting.enums.VoteStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "votes")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Vote {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "election_id", nullable = false)
    private Election election;

    @Column(name = "role_name", nullable = false)
    private String roleName;

    // null si es voto en blanco
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "candidacy_id")
    private Candidacy candidacy;

    @Column(name = "is_blank_vote", nullable = false)
    @Builder.Default
    private boolean blankVote = false;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private VoteStatus status = VoteStatus.PENDING;

    @Column(name = "emitted_at", nullable = false)
    private LocalDateTime emittedAt;
}
