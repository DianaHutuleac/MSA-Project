package com.citystories.backend.service;


import com.citystories.backend.domain.dto.pin.PinCreateDto;
import com.citystories.backend.domain.dto.pin.PinGetDto;
import com.citystories.backend.domain.entity.Pin;
import com.citystories.backend.domain.entity.UserData;
import com.citystories.backend.mapper.PinMapper;
import com.citystories.backend.repository.PinRepository;
import com.citystories.backend.repository.UserDataRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class PinService {
    private final PinRepository pinRepository;
    private final UserDataRepository userDataRepository;

    public PinService(PinRepository pinRepository, UserDataRepository userDataRepository) {
        this.pinRepository = pinRepository;
        this.userDataRepository = userDataRepository;
    }

    public PinGetDto createPin(PinCreateDto pinCreateDto) {
        UserData user = userDataRepository.findById(pinCreateDto.getUserId()).orElseThrow(
                () -> new IllegalArgumentException("User not found")
        );

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
