package com.sivou.api.results.service;

import com.sivou.api.candidacy.entity.Candidacy;
import com.sivou.api.candidacy.enums.CandidacyStatus;
import com.sivou.api.candidacy.repository.CandidacyRepository;
import com.sivou.api.election.entity.Election;
import com.sivou.api.election.enums.ElectionStatus;
import com.sivou.api.election.repository.ElectionRepository;
import com.sivou.api.results.dto.ElectionResultResponse;
import com.sivou.api.results.entity.ElectionResult;
import com.sivou.api.results.mapper.ResultsMapper;
import com.sivou.api.results.repository.ElectionResultRepository;
import com.sivou.api.shared.exception.ConflictException;
import com.sivou.api.shared.exception.NotFoundException;
import com.sivou.api.voting.entity.Vote;
import com.sivou.api.voting.enums.VoteStatus;
import com.sivou.api.voting.repository.VoteRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ResultsService {

    private final ElectionRepository electionRepository;
    private final VoteRepository voteRepository;
    private final CandidacyRepository candidacyRepository;
    private final ElectionResultRepository electionResultRepository;
    private final ResultsMapper resultsMapper;

    // HU-24 — Consolidar resultados al cierre
    // Se llama manualmente o desde el scheduler
    @Transactional
    public ElectionResultResponse consolidate(String electionId) {
        Election election = electionRepository.findById(electionId)
                .orElseThrow(() -> new NotFoundException("Elección no encontrada"));

        if (election.getStatus() != ElectionStatus.CLOSED) {
            throw new ConflictException("Solo se pueden consolidar elecciones en estado CLOSED");
        }

        // Si ya existen resultados, los borra y recalcula
        if (electionResultRepository.existsByElectionId(electionId)) {
            electionResultRepository.deleteByElectionId(electionId);
        }

        // Solo contar votos VALIDATED
        List<Vote> validatedVotes = voteRepository
                .findByElectionIdAndStatus(electionId, VoteStatus.VALIDATED);

        int totalVotes = validatedVotes.size();

        // Agrupar votos por candidatura (null = voto en blanco)
        Map<String, Long> votesByCandidacy = validatedVotes.stream()
                .filter(v -> !v.isBlankVote() && v.getCandidacy() != null)
                .collect(Collectors.groupingBy(
                        v -> v.getCandidacy().getId(),
                        Collectors.counting()
                ));

        long blankVotes = validatedVotes.stream()
                .filter(Vote::isBlankVote)
                .count();

        List<ElectionResult> results = new ArrayList<>();

        // Fila por cada candidatura aprobada
        List<Candidacy> approved = candidacyRepository
                .findByElectionIdAndStatus(electionId, CandidacyStatus.APPROVED);

        for (Candidacy candidacy : approved) {
            long count = votesByCandidacy.getOrDefault(candidacy.getId(), 0L);
            BigDecimal percentage = totalVotes > 0
                    ? BigDecimal.valueOf(count * 100.0 / totalVotes).setScale(2, RoundingMode.HALF_UP)
                    : BigDecimal.ZERO;

            // Obtener el rol del primer voto para esta candidatura (por consistencia)
            String roleName = validatedVotes.stream()
                    .filter(v -> v.getCandidacy() != null && v.getCandidacy().getId().equals(candidacy.getId()))
                    .findFirst()
                    .map(Vote::getRoleName)
                    .orElse("ROLE_VOTANTE");

            results.add(ElectionResult.builder()
                    .election(election)
                    .candidacy(candidacy)
                    .roleName(roleName)
                    .blank(false)
                    .voteCount((int) count)
                    .percentage(percentage)
                    .build());
        }

        // Fila para voto en blanco
        if (election.isBlankVote()) {
            BigDecimal blankPercentage = totalVotes > 0
                    ? BigDecimal.valueOf(blankVotes * 100.0 / totalVotes).setScale(2, RoundingMode.HALF_UP)
                    : BigDecimal.ZERO;

            results.add(ElectionResult.builder()
                    .election(election)
                    .roleName("BLANK")
                    .blank(true)
                    .voteCount((int) blankVotes)
                    .percentage(blankPercentage)
                    .build());

            // HU-27 (bonus): si voto en blanco >= 51%, marcar como REPEATING
            if (totalVotes > 0 && blankVotes * 100.0 / totalVotes >= 51.0) {
                log.info("Elección {} supera 51% voto en blanco. Marcando como REPEATING.", electionId);
                election.setStatus(ElectionStatus.REPEATING);
                electionRepository.save(election);
            }
        }

        electionResultRepository.saveAll(results);

        log.info("Resultados consolidados para elección {}. Total votos: {}", electionId, totalVotes);

        return resultsMapper.toResponse(
                election.getId(),
                election.getName(),
                election.getStatus().name(),
                totalVotes,
                results
        );
    }

    // HU-26 — Publicar resultados oficiales
    @Transactional
    public ElectionResultResponse publish(String electionId) {
        Election election = electionRepository.findById(electionId)
                .orElseThrow(() -> new NotFoundException("Elección no encontrada"));

        // Solo se puede publicar si está CLOSED o REPEATING (ya consolidado)
        if (election.getStatus() != ElectionStatus.CLOSED
                && election.getStatus() != ElectionStatus.REPEATING) {
            throw new ConflictException("Solo se pueden publicar resultados de elecciones CLOSED o REPEATING");
        }

        List<ElectionResult> results = electionResultRepository.findByElectionId(electionId);
        if (results.isEmpty()) {
            throw new ConflictException("Debes consolidar los resultados antes de publicarlos");
        }

        // Marcar fecha de publicación en cada fila
        LocalDateTime now = LocalDateTime.now();
        results.forEach(r -> r.setPublishedAt(now));
        electionResultRepository.saveAll(results);

        // Si no estaba REPEATING, pasar a FINISHED
        if (election.getStatus() == ElectionStatus.CLOSED) {
            election.setStatus(ElectionStatus.FINISHED);
            electionRepository.save(election);
        }

        log.info("Resultados publicados para elección {}.", electionId);

        int totalVotes = results.stream().mapToInt(ElectionResult::getVoteCount).sum();

        return resultsMapper.toResponse(
                election.getId(),
                election.getName(),
                election.getStatus().name(),
                totalVotes,
                results
        );
    }

    // Consultar resultados (solo si están publicados o si es admin)
    public ElectionResultResponse getResults(String electionId) {
        Election election = electionRepository.findById(electionId)
                .orElseThrow(() -> new NotFoundException("Elección no encontrada"));

        List<ElectionResult> results = electionResultRepository.findByElectionId(electionId);

        if (results.isEmpty()) {
            throw new NotFoundException("Aún no hay resultados consolidados para esta elección");
        }

        // Solo mostrar si están publicados (tienen publishedAt)
        boolean published = results.stream().anyMatch(r -> r.getPublishedAt() != null);
        if (!published) {
            throw new ConflictException("Los resultados aún no han sido publicados");
        }

        int totalVotes = results.stream().mapToInt(ElectionResult::getVoteCount).sum();

        return resultsMapper.toResponse(
                election.getId(),
                election.getName(),
                election.getStatus().name(),
                totalVotes,
                results
        );
    }
}
