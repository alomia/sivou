package com.sivou.api.candidacy.service;

import com.sivou.api.auth.entity.User;
import com.sivou.api.auth.repository.UserRepository;
import com.sivou.api.candidacy.dto.CandidacyResponse;
import com.sivou.api.candidacy.dto.RegisterCandidacyRequest;
import com.sivou.api.candidacy.dto.ReviewCandidacyRequest;
import com.sivou.api.candidacy.entity.Candidacy;
import com.sivou.api.candidacy.entity.CandidacyMember;
import com.sivou.api.candidacy.enums.CandidacyModality;
import com.sivou.api.candidacy.enums.CandidacyStatus;
import com.sivou.api.candidacy.enums.SlateRole;
import com.sivou.api.candidacy.mapper.CandidacyMapper;
import com.sivou.api.candidacy.repository.CandidacyRepository;
import com.sivou.api.election.entity.Election;
import com.sivou.api.election.enums.ElectionStatus;
import com.sivou.api.election.repository.ElectionRepository;
import com.sivou.api.shared.exception.ConflictException;
import com.sivou.api.shared.exception.NotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CandidacyService {

    private final CandidacyRepository candidacyRepository;
    private final ElectionRepository electionRepository;
    private final UserRepository userRepository;
    private final CandidacyMapper candidacyMapper;

    // HU-06 — Registrar candidatura
    @Transactional
    public CandidacyResponse register(String electionId, RegisterCandidacyRequest request) {
        Election election = electionRepository.findById(electionId)
                .orElseThrow(() -> new NotFoundException("Elección no encontrada"));

        // Solo se puede inscribir en elecciones publicadas
        if (election.getStatus() != ElectionStatus.PUBLISHED) {
            throw new ConflictException("Solo se pueden registrar candidaturas en elecciones publicadas");
        }

        validateModality(request);

        Candidacy candidacy = Candidacy.builder()
                .election(election)
                .modality(request.getModality())
                .build();

        // Construir miembros
        List<CandidacyMember> members = request.getMembers().stream()
                .map(memberReq -> {
                    User user = userRepository.findById(memberReq.getUserId())
                            .orElseThrow(() -> new NotFoundException(
                                "Usuario no encontrado: " + memberReq.getUserId()));
                    return CandidacyMember.builder()
                            .candidacy(candidacy)
                            .user(user)
                            .roleInSlate(memberReq.getRoleInSlate())
                            .build();
                })
                .toList();

        candidacy.setMembers(members);
        Candidacy saved = candidacyRepository.saveAndFlush(candidacy);
        return candidacyMapper.toResponse(saved);
    }

    // HU-04 — Listar candidaturas de una elección
    // Si status=APPROVED devuelve solo las aprobadas (lista pública)
    // Sin filtro devuelve todas (para admin/sec_gral)
    public List<CandidacyResponse> findByElection(String electionId, CandidacyStatus status) {
        electionRepository.findById(electionId)
                .orElseThrow(() -> new NotFoundException("Elección no encontrada"));

        List<Candidacy> candidacies = status != null
                ? candidacyRepository.findByElectionIdAndStatus(electionId, status)
                : candidacyRepository.findByElectionId(electionId);

        return candidacies.stream()
                .map(candidacyMapper::toResponse)
                .toList();
    }

    // HU-08 — Aprobar o rechazar candidatura
    @Transactional
    public CandidacyResponse review(String candidacyId, ReviewCandidacyRequest request) {
        Candidacy candidacy = candidacyRepository.findById(candidacyId)
                .orElseThrow(() -> new NotFoundException("Candidatura no encontrada"));

        if (candidacy.getStatus() != CandidacyStatus.PENDING) {
            throw new ConflictException("Solo se pueden revisar candidaturas en estado PENDING");
        }

        if (request.getStatus() == CandidacyStatus.REJECTED && 
            (request.getRejectReason() == null || request.getRejectReason().isBlank())) {
            throw new ConflictException("Debe indicar el motivo de rechazo");
        }

        if (request.getStatus() == CandidacyStatus.PENDING) {
            throw new ConflictException("El estado de revisión debe ser APPROVED o REJECTED");
        }

        candidacy.setStatus(request.getStatus());
        candidacy.setRejectReason(request.getRejectReason());

        Candidacy saved = candidacyRepository.saveAndFlush(candidacy);
        return candidacyMapper.toResponse(saved);
    }

    // Validar coherencia entre modalidad y miembros
    private void validateModality(RegisterCandidacyRequest request) {
        long principalCount = request.getMembers().stream()
                .filter(m -> m.getRoleInSlate() == SlateRole.PRINCIPAL)
                .count();

        if (principalCount != 1) {
            throw new ConflictException("Debe haber exactamente un miembro con rol PRINCIPAL");
        }

        if (request.getModality() == CandidacyModality.INDIVIDUAL && request.getMembers().size() != 1) {
            throw new ConflictException("Una candidatura INDIVIDUAL debe tener exactamente un miembro");
        }

        if (request.getModality() == CandidacyModality.PLANCHA && request.getMembers().size() < 2) {
            throw new ConflictException("Una PLANCHA debe tener al menos 2 miembros (principal + suplente)");
        }
    }
}
