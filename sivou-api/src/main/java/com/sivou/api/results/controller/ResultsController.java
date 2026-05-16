package com.sivou.api.results.controller;

import com.sivou.api.results.dto.ElectionResultResponse;
import com.sivou.api.results.service.ResultsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/elections/{electionId}/results")
public class ResultsController {

    private final ResultsService resultsService;

    // HU-24 — Consolidar resultados (solo admin/sec_gral)
    @PostMapping("/consolidate")
    public ResponseEntity<ElectionResultResponse> consolidate(@PathVariable String electionId) {
        return ResponseEntity.ok(resultsService.consolidate(electionId));
    }

    // HU-26 — Publicar resultados (solo admin/sec_gral)
    @PostMapping("/publish")
    public ResponseEntity<ElectionResultResponse> publish(@PathVariable String electionId) {
        return ResponseEntity.ok(resultsService.publish(electionId));
    }

    // Consultar resultados públicos
    @GetMapping
    public ResponseEntity<ElectionResultResponse> getResults(@PathVariable String electionId) {
        return ResponseEntity.ok(resultsService.getResults(electionId));
    }
}
