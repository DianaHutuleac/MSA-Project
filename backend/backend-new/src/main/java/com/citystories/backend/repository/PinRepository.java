package com.citystories.backend.repository;

import com.citystories.backend.domain.entity.Pin;
import com.citystories.backend.domain.entity.UserData;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface PinRepository extends JpaRepository<Pin, Long> {
    void deleteByExpiresAtBeforeAndExpiresAtIsNotNull(LocalDateTime now);
    Optional<Pin> getPinByUserId(Long userId);
    List<Pin> getAllPinsByUserId(Long userId);
}
