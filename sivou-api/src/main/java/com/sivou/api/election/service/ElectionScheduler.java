package com.sivou.api.election.service;

import com.sivou.api.election.entity.Election;
import com.sivou.api.election.enums.ElectionStatus;
import com.sivou.api.election.repository.ElectionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class ElectionScheduler {

    private final ElectionRepository electionRepository;

    // Corre cada minuto y verifica si alguna elección OPEN debe cerrarse
    // HU-23: cierre automático al finalizar el horario definido
    @Scheduled(fixedDelay = 60000)
    @Transactional
    public void closeExpiredElections() {
        LocalDate today = LocalDate.now();
        LocalTime now = LocalTime.now();

        List<Election> openElections = electionRepository.findByStatus(ElectionStatus.OPEN);

        for (Election election : openElections) {
            boolean pastEndDate = election.getEndDate().isBefore(today);
            boolean endedToday = election.getEndDate().isEqual(today)
                    && election.getEndTime().isBefore(now);

            if (pastEndDate || endedToday) {
                election.setStatus(ElectionStatus.CLOSED);
                electionRepository.save(election);
                log.info("Elección '{}' cerrada automáticamente.", election.getName());
            }
        }
    }

    // Corre cada minuto y abre elecciones PUBLISHED que ya deben estar abiertas
    @Scheduled(fixedDelay = 60000)
    @Transactional
    public void openScheduledElections() {
        LocalDate today = LocalDate.now();
        LocalTime now = LocalTime.now();

        List<Election> publishedElections = electionRepository.findByStatus(ElectionStatus.PUBLISHED);

        for (Election election : publishedElections) {
            boolean startedBeforeToday = election.getStartDate().isBefore(today);
            boolean startsNow = election.getStartDate().isEqual(today)
                    && !election.getStartTime().isAfter(now);

            if (startedBeforeToday || startsNow) {
                election.setStatus(ElectionStatus.OPEN);
                electionRepository.save(election);
                log.info("Elección '{}' abierta automáticamente.", election.getName());
            }
        }
    }
}
