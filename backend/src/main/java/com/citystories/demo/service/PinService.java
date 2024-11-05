package com.citystories.demo.service;


import com.citystories.demo.domain.dto.pin.PinCreateDto;
import com.citystories.demo.domain.dto.pin.PinGetDto;
import com.citystories.demo.domain.entity.Pin;
import com.citystories.demo.mapper.PinMapper;
import com.citystories.demo.repository.PinRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class PinService {
    private final PinRepository pinRepository;

    public PinService(PinRepository pinRepository) {
        this.pinRepository = pinRepository;
    }

    public PinGetDto createPin(PinCreateDto pinCreateDto) {
        Pin pin = PinMapper.INSTANCE.pinCreateDtoToPin(pinCreateDto);
        Pin createdPin = pinRepository.save(pin);
        return PinMapper.INSTANCE.pinToPinGetDto(createdPin);
    }

    @Scheduled(cron = "0 0 0 * * ?")
    public void deleteExpiredPins() {
        LocalDateTime now = LocalDateTime.now();
        pinRepository.deleteByExpiresAtBeforeAndExpiresAtIsNotNull(now);
    }
}
