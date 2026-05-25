package com.sivou.api.candidacy.controller;

import com.sivou.api.candidacy.dto.CandidacyResponse;
import com.sivou.api.candidacy.dto.RegisterCandidacyRequest;
import com.sivou.api.candidacy.dto.ReviewCandidacyRequest;
import com.sivou.api.candidacy.enums.CandidacyStatus;
import com.sivou.api.candidacy.service.CandidacyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/elections/{electionId}/candidacies")
public class CandidacyController {

    private final CandidacyService candidacyService;

    // HU-06 — Registrar candidatura en una elección
    @PostMapping
    public ResponseEntity<CandidacyResponse> register(
            @PathVariable String electionId,
            @Valid @RequestBody RegisterCandidacyRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(candidacyService.register(electionId, request));
    }

    // HU-04 — Listar candidaturas
    // ?status=APPROVED → lista pública de admitidos
    // sin filtro → todas (admin/sec_gral)
    @GetMapping
    public ResponseEntity<List<CandidacyResponse>> findByElection(
            @PathVariable String electionId,
            @RequestParam(required = false) CandidacyStatus status) {
        return ResponseEntity.ok(candidacyService.findByElection(electionId, status));
    }

    // HU-08 — Aprobar o rechazar candidatura
    @PatchMapping("/{candidacyId}/review")
    public ResponseEntity<CandidacyResponse> review(
            @PathVariable String electionId,
            @PathVariable String candidacyId,
            @Valid @RequestBody ReviewCandidacyRequest request) {
        return ResponseEntity.ok(candidacyService.review(candidacyId, request));
    }
}
