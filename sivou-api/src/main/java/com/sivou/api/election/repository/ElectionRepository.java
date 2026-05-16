package com.sivou.api.election.repository;

import com.sivou.api.election.entity.Election;
import com.sivou.api.election.enums.ElectionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ElectionRepository extends JpaRepository<Election, String> {
    List<Election> findByStatus(ElectionStatus status);
    List<Election> findByStatusNot(ElectionStatus status);
}
