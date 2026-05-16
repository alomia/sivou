package com.sivou.api.election.service;

import com.sivou.api.auth.entity.User;
import com.sivou.api.auth.repository.UserRepository;
import com.sivou.api.election.dto.CreateElectionRequest;
import com.sivou.api.election.dto.ElectionResponse;
import com.sivou.api.election.dto.UpdateElectionStatusRequest;
import com.sivou.api.election.entity.Election;
import com.sivou.api.election.enums.ElectionStatus;
import com.sivou.api.election.mapper.ElectionMapper;
import com.sivou.api.election.repository.ElectionRepository;
import com.sivou.api.shared.exception.ConflictException;
import com.sivou.api.shared.exception.NotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class ElectionService {

    private final ElectionRepository electionRepository;
    private final UserRepository userRepository;
    private final ElectionMapper electionMapper;

    // HU-01 — Crear elección
    // HU-05 — Voto en blanco siempre habilitado (se configura aquí)
    @Transactional
    public ElectionResponse create(CreateElectionRequest request) {
        validateDates(request);

        User currentUser = getCurrentUser();
        Election election = electionMapper.toEntity(request, currentUser);

        // HU-05: El voto en blanco siempre debe estar habilitado
        // según el Acuerdo 004/2021 Art. 20
        election.setBlankVote(true);

        Election saved = electionRepository.saveAndFlush(election);
        return electionMapper.toResponse(saved);
    }

    // Listar todas las elecciones
    public List<ElectionResponse> findAll() {
        return electionRepository.findAll()
                .stream()
                .map(electionMapper::toResponse)
                .toList();
    }

    // Obtener elección por ID
    public ElectionResponse findById(String id) {
        Election election = electionRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Elección no encontrada"));
        return electionMapper.toResponse(election);
    }

    // HU-03 — Habilitar/deshabilitar elección (cambiar estado)
    @Transactional
    public ElectionResponse updateStatus(String id, UpdateElectionStatusRequest request) {
        Election election = electionRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Elección no encontrada"));

        validateStatusTransition(election.getStatus(), request.getStatus());

        election.setStatus(request.getStatus());
        Election saved = electionRepository.save(election);
        return electionMapper.toResponse(saved);
    }

    // Validaciones de fechas
    private void validateDates(CreateElectionRequest request) {
        if (request.getEndDate().isBefore(request.getStartDate())) {
            throw new ConflictException("La fecha de fin no puede ser anterior a la fecha de inicio");
        }
        if (request.getEndDate().isEqual(request.getStartDate()) &&
                request.getEndTime().isBefore(request.getStartTime())) {
            throw new ConflictException("La hora de fin no puede ser anterior a la hora de inicio");
        }
    }

    // Transiciones de estado válidas
    // DRAFT → PUBLISHED → OPEN → CLOSED → FINISHED
    //                              ↓
    //                           REPEATING
    private void validateStatusTransition(ElectionStatus current, ElectionStatus next) {
        Map<ElectionStatus, Set<ElectionStatus>> validTransitions = Map.of(
                ElectionStatus.DRAFT,      Set.of(ElectionStatus.PUBLISHED),
                ElectionStatus.PUBLISHED,  Set.of(ElectionStatus.OPEN, ElectionStatus.DRAFT),
                ElectionStatus.OPEN,       Set.of(ElectionStatus.CLOSED),
                ElectionStatus.CLOSED,     Set.of(ElectionStatus.FINISHED, ElectionStatus.REPEATING),
                ElectionStatus.REPEATING,  Set.of(ElectionStatus.OPEN),
                ElectionStatus.FINISHED,   Set.of()
        );

        Set<ElectionStatus> allowed = validTransitions.getOrDefault(current, Set.of());
        if (!allowed.contains(next)) {
            throw new ConflictException(
                    "Transición de estado inválida: " + current + " → " + next +
                            ". Estados permitidos desde " + current + ": " + allowed
            );
        }
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("Usuario no encontrado"));
    }
}
