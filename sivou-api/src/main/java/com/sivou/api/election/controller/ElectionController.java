package com.sivou.api.election.controller;

import com.sivou.api.election.dto.CreateElectionRequest;
import com.sivou.api.election.dto.ElectionResponse;
import com.sivou.api.election.dto.UpdateElectionStatusRequest;
import com.sivou.api.election.service.ElectionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/elections")
public class ElectionController {

    private final ElectionService electionService;

    // HU-01 — Crear elección
    @PostMapping
    public ResponseEntity<ElectionResponse> create(@Valid @RequestBody CreateElectionRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(electionService.create(request));
    }

    // Listar todas las elecciones
    @GetMapping
    public ResponseEntity<List<ElectionResponse>> findAll() {
        return ResponseEntity.ok(electionService.findAll());
    }

    // Obtener elección por ID
    @GetMapping("/{id}")
    public ResponseEntity<ElectionResponse> findById(@PathVariable String id) {
        return ResponseEntity.ok(electionService.findById(id));
    }

    // HU-03 — Habilitar/deshabilitar elección (cambiar estado)
    @PatchMapping("/{id}/status")
    public ResponseEntity<ElectionResponse> updateStatus(
            @PathVariable String id,
            @Valid @RequestBody UpdateElectionStatusRequest request) {
        return ResponseEntity.ok(electionService.updateStatus(id, request));
    }
}
