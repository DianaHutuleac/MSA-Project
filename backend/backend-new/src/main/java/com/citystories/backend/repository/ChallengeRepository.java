package com.citystories.backend.repository;

import com.citystories.backend.domain.entity.Challenge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.Optional;

public interface ChallengeRepository extends JpaRepository<Challenge, Long> {
    @Query(
            value = "SELECT * FROM challenge c WHERE c.start_date <= :currentDate AND c.end_date >= :currentDate ORDER BY c.start_date ASC LIMIT 1",
            nativeQuery = true
    )
    Optional<Challenge> findActiveChallenge(@Param("currentDate") LocalDateTime currentDate);

    @Query("SELECT c FROM Challenge c WHERE c.endDate < :currentDate AND c.processed = false ORDER BY c.endDate DESC LIMIT 1")
    Optional<Challenge> findUnprocessedChallengeBefore(@Param("currentDate") LocalDateTime currentDate);

    @Query("SELECT c FROM Challenge c " +
            "WHERE c.processed = true " +
            "ORDER BY c.endDate DESC LIMIT 1")
    Optional<Challenge> findLastProcessedChallenge();

}
