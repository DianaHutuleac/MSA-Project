package com.citystories.backend.repository;

import com.citystories.backend.domain.entity.Challenge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.Optional;

public interface ChallengeRepository extends JpaRepository<Challenge, Long> {
    @Query("SELECT c FROM Challenge c WHERE c.startDate <= :currentDate AND c.endDate >= :currentDate")
    Optional<Challenge> findActiveChallenge(@Param("currentDate") LocalDateTime currentDate);
}
