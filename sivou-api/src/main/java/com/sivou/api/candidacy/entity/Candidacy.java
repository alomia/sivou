package com.sivou.api.candidacy.entity;

import com.sivou.api.candidacy.enums.CandidacyModality;
import com.sivou.api.candidacy.enums.CandidacyStatus;
import com.sivou.api.election.entity.Election;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "candidacies")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Candidacy {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "election_id", nullable = false)
    private Election election;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CandidacyModality modality;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private CandidacyStatus status = CandidacyStatus.PENDING;

    @Column(name = "reject_reason", columnDefinition = "TEXT")
    private String rejectReason;

    @OneToMany(mappedBy = "candidacy", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @Builder.Default
    private List<CandidacyMember> members = new ArrayList<>();

    @OneToOne(mappedBy = "candidacy", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private CandidacyMedia media;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
