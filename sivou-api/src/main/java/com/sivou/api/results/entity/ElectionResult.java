package com.sivou.api.results.entity;

import com.sivou.api.candidacy.entity.Candidacy;
import com.sivou.api.election.entity.Election;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "election_results")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ElectionResult {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "election_id", nullable = false)
    private Election election;

    @Column(name = "role_name", nullable = false)
    private String roleName;

    // null si es la fila del voto en blanco
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "candidacy_id")
    private Candidacy candidacy;

    @Column(name = "is_blank", nullable = false)
    @Builder.Default
    private boolean blank = false;

    @Column(name = "vote_count", nullable = false)
    @Builder.Default
    private int voteCount = 0;

    @Column(nullable = false)
    @Builder.Default
    private BigDecimal percentage = BigDecimal.ZERO;

    @Column(name = "published_at")
    private LocalDateTime publishedAt;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
