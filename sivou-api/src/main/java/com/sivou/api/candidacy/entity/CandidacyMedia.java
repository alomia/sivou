package com.sivou.api.candidacy.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "candidacy_media")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CandidacyMedia {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "candidacy_id", nullable = false)
    private Candidacy candidacy;

    @Column(name = "photo_url")
    private String photoUrl;

    @Column(name = "proposal_pdf_url")
    private String proposalPdfUrl;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
