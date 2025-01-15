package com.citystories.backend.repository;

import com.citystories.backend.domain.entity.Pin;
import com.citystories.backend.domain.entity.UserData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface PinRepository extends JpaRepository<Pin, Long> {
    void deleteByExpiresAtBeforeAndExpiresAtIsNotNull(LocalDateTime now);
    Optional<Pin> getPinByUserId(Long userId);
    List<Pin> getAllPinsByUserId(Long userId);
    List<Pin> findByExpiresAtBeforeAndExpiresAtIsNotNull(LocalDateTime now);

    @Query("SELECT p FROM Pin p WHERE p.challenge.id = :challengeId")
    List<Pin> findByChallengeId(@Param("challengeId") Long challengeId);

}
