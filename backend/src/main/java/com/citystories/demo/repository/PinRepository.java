package com.citystories.demo.repository;

import com.citystories.demo.domain.entity.Pin;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;

public interface PinRepository extends JpaRepository<Pin, Long> {
    void deleteByExpiresAtBeforeAndExpiresAtIsNotNull(LocalDateTime now);
}
