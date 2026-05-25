package com.sivou.api.voting.controller;

import com.sivou.api.voting.dto.BallotResponse;
import com.sivou.api.voting.dto.CastVoteRequest;
import com.sivou.api.voting.dto.VoteResponse;
import com.sivou.api.voting.service.VotingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/elections/{electionId}")
public class VotingController {

    private final VotingService votingService;

    // HU-14 — Ver tarjetón electoral
    @GetMapping("/ballot")
    public ResponseEntity<BallotResponse> getBallot(@PathVariable String electionId) {
        return ResponseEntity.ok(votingService.getBallot(electionId));
    }

    // HU-11, 13, 17, 18 — Emitir voto
    @PostMapping("/vote")
    public ResponseEntity<VoteResponse> castVote(
            @PathVariable String electionId,
            @Valid @RequestBody CastVoteRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(votingService.castVote(electionId, request));
    }

    // Consultar si el usuario autenticado ya votó
    @GetMapping("/has-voted")
    public ResponseEntity<Map<String, Boolean>> hasVoted(
            @PathVariable String electionId,
            @RequestParam String roleName) {
        boolean voted = votingService.hasVoted(electionId, roleName);
        return ResponseEntity.ok(Map.of("hasVoted", voted));
    }
}
