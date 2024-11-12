package com.citystories.backend.service.impl;


import com.citystories.backend.domain.dto.pin.PinCreateDto;
import com.citystories.backend.domain.dto.pin.PinEditDto;
import com.citystories.backend.domain.dto.pin.PinGetDto;
import com.citystories.backend.domain.entity.Pin;
import com.citystories.backend.domain.entity.UserData;
import com.citystories.backend.exception.PinNotFoundException;
import com.citystories.backend.exception.UserNotFoundException;
import com.citystories.backend.mapper.PinMapper;
import com.citystories.backend.repository.PinRepository;
import com.citystories.backend.repository.UserDataRepository;
import com.citystories.backend.service.PinService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class PinServiceImpl implements PinService {
    private final PinRepository pinRepository;
    private final UserDataRepository userDataRepository;

    public PinServiceImpl(PinRepository pinRepository, UserDataRepository userDataRepository) {
        this.pinRepository = pinRepository;
        this.userDataRepository = userDataRepository;
    }

    @Override
    public PinGetDto createPin(PinCreateDto pinCreateDto) {
        UserData user = findUserById(pinCreateDto.getUserId());
        Pin pin = mapCreatePinDtoToPin(pinCreateDto, user);
        Pin createdPin = pinRepository.save(pin);
        return PinMapper.INSTANCE.pinToPinGetDto(createdPin);
    }

    @Override
    public PinGetDto getPin(Long id) {
        Pin pin = findPinById(id);
        return PinMapper.INSTANCE.pinToPinGetDto(pin);
    }

    @Override
    public PinGetDto updatePin(Long id, PinEditDto pinEditDto) {
        pinEditDto.setId(id);
        Pin pin = findPinById(pinEditDto.getId());
        Pin editedPin = applyEditsToPin(pinEditDto, pin);
        return PinMapper.INSTANCE.pinToPinGetDto(editedPin);
    }

    private Pin applyEditsToPin(PinEditDto pinEditDto, Pin pin) {
        if (pinEditDto.getStory() != null) {
            pin.setStory(pinEditDto.getStory());
        }
        if (pinEditDto.getVisibilityDuration() != null) {
            pin.setVisibilityDuration(pinEditDto.getVisibilityDuration());
        }
        return pinRepository.save(pin);
    }

    @Override
    public void deletePin(Long id) {
        Pin pin = findPinById(id);
        pinRepository.delete(pin);
    }

    private Pin findPinById(Long pinId) {
        return pinRepository.findById(pinId)
                .orElseThrow(() -> new PinNotFoundException("Pin with ID " + pinId + " not found"));
    }

    private UserData findUserById(Long userId) {
        return userDataRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User with ID " + userId + " not found"));
    }

    private Pin mapCreatePinDtoToPin(PinCreateDto pinCreateDto, UserData user) {
        Pin pin = PinMapper.INSTANCE.pinCreateDtoToPin(pinCreateDto);
        pin.setUser(user);
        return pin;
    }

    @Scheduled(cron = "0 0 0 * * ?")
    @Override
    public void deleteExpiredPins() {
        LocalDateTime now = LocalDateTime.now();
        pinRepository.deleteByExpiresAtBeforeAndExpiresAtIsNotNull(now);
    }
}
