package com.sivou.api.voting.service;

import com.sivou.api.auth.entity.User;
import com.sivou.api.auth.repository.UserRepository;
import com.sivou.api.candidacy.entity.Candidacy;
import com.sivou.api.candidacy.enums.CandidacyStatus;
import com.sivou.api.candidacy.repository.CandidacyRepository;
import com.sivou.api.election.entity.Election;
import com.sivou.api.election.enums.ElectionStatus;
import com.sivou.api.election.repository.ElectionRepository;
import com.sivou.api.shared.exception.ConflictException;
import com.sivou.api.shared.exception.NotFoundException;
import com.sivou.api.voting.dto.BallotResponse;
import com.sivou.api.voting.dto.CastVoteRequest;
import com.sivou.api.voting.dto.VoteResponse;
import com.sivou.api.voting.entity.Vote;
import com.sivou.api.voting.entity.VotingToken;
import com.sivou.api.voting.mapper.VoteMapper;
import com.sivou.api.voting.repository.VoteRepository;
import com.sivou.api.voting.repository.VotingTokenRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class VotingService {

    private final VoteRepository voteRepository;
    private final VotingTokenRepository votingTokenRepository;
    private final ElectionRepository electionRepository;
    private final CandidacyRepository candidacyRepository;
    private final UserRepository userRepository;
    private final VoteMapper voteMapper;

    // HU-14 — Tarjetón electoral
    // Devuelve candidaturas APROBADAS de una elección abierta
    public BallotResponse getBallot(String electionId) {
        Election election = electionRepository.findById(electionId)
                .orElseThrow(() -> new NotFoundException("Elección no encontrada"));

        if (election.getStatus() != ElectionStatus.OPEN) {
            throw new ConflictException("El tarjetón solo está disponible en elecciones abiertas");
        }

        List<Candidacy> approved = candidacyRepository
                .findByElectionIdAndStatus(electionId, CandidacyStatus.APPROVED);

        List<BallotResponse.BallotCandidacy> items = approved.stream()
                .map(c -> {
                    // Busca el miembro PRINCIPAL para mostrar su nombre
                    String principalName = c.getMembers().stream()
                            .filter(m -> m.getRoleInSlate().name().equals("PRINCIPAL"))
                            .findFirst()
                            .map(m -> m.getUser().getFirstName() + " " + m.getUser().getLastName())
                            .orElse("Sin nombre");

                    String photoUrl = c.getMedia() != null ? c.getMedia().getPhotoUrl() : null;
                    String pdfUrl   = c.getMedia() != null ? c.getMedia().getProposalPdfUrl() : null;

                    return new BallotResponse.BallotCandidacy(
                            c.getId(),
                            c.getModality().name(),
                            principalName,
                            photoUrl,
                            pdfUrl
                    );
                })
                .toList();

        return new BallotResponse(
                election.getId(),
                election.getName(),
                election.isBlankVote(),
                items
        );
    }

    // HU-11, HU-13, HU-17, HU-18 — Emitir voto
    @Transactional
    public VoteResponse castVote(String electionId, CastVoteRequest request) {
        // 1. Verificar que la elección existe y está abierta
        Election election = electionRepository.findById(electionId)
                .orElseThrow(() -> new NotFoundException("Elección no encontrada"));

        if (election.getStatus() != ElectionStatus.OPEN) {
            throw new ConflictException("La elección no está abierta para votar");
        }

        // 2. Obtener usuario autenticado
        User currentUser = getCurrentUser();

        // 3. HU-11: verificar que el rol del votante está habilitado en esta elección
        if (!election.getAllowedRoles().contains(request.getRoleName())) {
            throw new ConflictException("Tu rol no está habilitado para votar en esta elección");
        }

        // 4. HU-13: impedir doble voto — buscar si ya existe token para esta combinación
        votingTokenRepository
                .findByElectionIdAndUserIdAndRoleName(electionId, currentUser.getId(), request.getRoleName())
                .ifPresent(token -> {
                    if (token.isUsed()) {
                        throw new ConflictException("Ya votaste en esta elección con el rol " + request.getRoleName());
                    }
                });

        // 5. Validar que voto en blanco o candidatura — no ambos, no ninguno
        if (request.isBlankVote() && request.getCandidacyId() != null) {
            throw new ConflictException("No puedes seleccionar candidatura y voto en blanco al mismo tiempo");
        }
        if (!request.isBlankVote() && request.getCandidacyId() == null) {
            throw new ConflictException("Debes seleccionar una candidatura o marcar voto en blanco");
        }

        // 6. Si no es voto en blanco, verificar que la candidatura existe y está aprobada
        Candidacy candidacy = null;
        if (!request.isBlankVote()) {
            candidacy = candidacyRepository.findById(request.getCandidacyId())
                    .orElseThrow(() -> new NotFoundException("Candidatura no encontrada"));

            if (candidacy.getStatus() != CandidacyStatus.APPROVED) {
                throw new ConflictException("La candidatura seleccionada no está aprobada");
            }

            if (!candidacy.getElection().getId().equals(electionId)) {
                throw new ConflictException("La candidatura no pertenece a esta elección");
            }
        }

        // 7. HU-17: registrar el voto (SIN referencia al usuario — secreto del voto)
        Vote vote = Vote.builder()
                .election(election)
                .roleName(request.getRoleName())
                .candidacy(candidacy)
                .blankVote(request.isBlankVote())
                .emittedAt(LocalDateTime.now())
                .build();

        Vote saved = voteRepository.save(vote);

        // 8. HU-13: marcar el token como usado (o crearlo si es la primera vez)
        VotingToken token = votingTokenRepository
                .findByElectionIdAndUserIdAndRoleName(electionId, currentUser.getId(), request.getRoleName())
                .orElse(VotingToken.builder()
                        .election(election)
                        .user(currentUser)
                        .roleName(request.getRoleName())
                        .build());

        token.setUsed(true);
        votingTokenRepository.save(token);

        // 9. HU-18: devolver confirmación al votante
        return voteMapper.toResponse(saved);
    }

    // Consultar si el usuario ya votó en una elección con un rol
    public boolean hasVoted(String electionId, String roleName) {
        User currentUser = getCurrentUser();
        return votingTokenRepository
                .findByElectionIdAndUserIdAndRoleName(electionId, currentUser.getId(), roleName)
                .map(VotingToken::isUsed)
                .orElse(false);
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("Usuario no encontrado"));
    }
}
