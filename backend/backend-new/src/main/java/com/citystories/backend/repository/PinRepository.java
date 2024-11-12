package com.citystories.backend.repository;

import com.citystories.backend.domain.entity.Pin;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;

public interface PinRepository extends JpaRepository<Pin, Long> {
    void deleteByExpiresAtBeforeAndExpiresAtIsNotNull(LocalDateTime now);
}
