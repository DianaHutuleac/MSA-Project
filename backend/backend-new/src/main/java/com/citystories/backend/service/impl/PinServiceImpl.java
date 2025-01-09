package com.citystories.backend.service.impl;


import com.citystories.backend.domain.dto.pin.PinCreateDto;
import com.citystories.backend.domain.dto.pin.PinEditDto;
import com.citystories.backend.domain.dto.pin.PinResponseDto;
import com.citystories.backend.domain.entity.Pin;
import com.citystories.backend.domain.entity.UserData;
import com.citystories.backend.exception.PinNotFoundException;
import com.citystories.backend.exception.UserNotFoundException;
import com.citystories.backend.mapper.PinMapper;
import com.citystories.backend.repository.PinRepository;
import com.citystories.backend.repository.UserDataRepository;
import com.citystories.backend.service.PinService;
import jakarta.transaction.Transactional;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class PinServiceImpl implements PinService {
    private final PinRepository pinRepository;
    private final UserDataRepository userDataRepository;

    public PinServiceImpl(PinRepository pinRepository, UserDataRepository userDataRepository) {
        this.pinRepository = pinRepository;
        this.userDataRepository = userDataRepository;
    }

    @Override
    public PinResponseDto getPin(Long id) {
        Pin pin = findPinById(id);
        return mapToResponseDto(pin);
    }

    @Override
    public PinResponseDto getPinByUserId(Long userId) {
        findUserById(userId);
        Pin pin = findPinByUserId(userId);

        return mapToResponseDto(pin);
    }

    @Override
    public List<PinResponseDto> getAllPinsForUser(Long userId) {
        findUserById(userId);
        return mapToResponseDtoList(pinRepository.getAllPinsByUserId(userId));
    }

    @Override
    public List<PinResponseDto> getAllPins() {
        return mapToResponseDtoList(pinRepository.findAll());
    }

    @Override
    public PinResponseDto createPin(PinCreateDto pinCreateDto) {
        // Extract authenticated user ID from the SecurityContext
        String authenticatedUserId = SecurityContextHolder.getContext().getAuthentication().getName();
        if (authenticatedUserId == null) {
            throw new UserNotFoundException("User ID is not available in the SecurityContext.");
        }

        // Set the userId in the DTO
        pinCreateDto.setUserId(Long.parseLong(authenticatedUserId));

        // Proceed with creating the pin
        UserData user = findUserById(pinCreateDto.getUserId());
        Pin pin = mapCreatePinDtoToPin(pinCreateDto, user);
        Pin createdPin = pinRepository.save(pin);
        return mapToResponseDto(createdPin);
    }


    @Override
    public PinResponseDto updatePin(Long id, PinEditDto pinEditDto) {
        Pin pin = findPinById(id);
        pinEditDto.setId(id);
        Pin editedPin = applyEditsToPin(pinEditDto, pin);
        return mapToResponseDto(pinRepository.save(editedPin));
    }

    @Override
    public void deletePin(Long id) {
        Pin pin = findPinById(id);
        pinRepository.delete(pin);
    }

    @Scheduled(cron = "0 0 0 * * ?")
    @Override
    public void deleteExpiredPins() {
        LocalDateTime now = LocalDateTime.now();
        pinRepository.deleteByExpiresAtBeforeAndExpiresAtIsNotNull(now);
    }

    @Transactional
    @Override
    public PinResponseDto addLikeToPin(Long pinId) {
        Pin pin = findPinById(pinId);
        pin.setNumberOfLikes(pin.getNumberOfLikes() + 1);
        Pin savedPin = pinRepository.save(pin);
        return mapToResponseDto(savedPin);
    }

    @Transactional
    @Override
    public PinResponseDto removeLikeFromPin(Long pinId) {
        Pin pin = findPinById(pinId);
        pin.setNumberOfLikes(pin.getNumberOfLikes() - 1);
        Pin savedPin = pinRepository.save(pin);
        return mapToResponseDto(savedPin);
    }

    private Pin findPinById(Long pinId) {
        return pinRepository.findById(pinId)
                .orElseThrow(() -> new PinNotFoundException("Pin with ID " + pinId + " not found"));
    }

    private Pin findPinByUserId(Long userId) {
        return pinRepository.getPinByUserId(userId)
                .orElseThrow(() -> new PinNotFoundException("Pin with User ID " + userId + " not found"));
    }

    private UserData findUserById(Long userId) {
        return userDataRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User with ID " + userId + " not found"));
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

    private PinResponseDto mapToResponseDto(Pin pin) {
        return PinMapper.INSTANCE.pinToPinGetDto(pin);
    }

    private List<PinResponseDto> mapToResponseDtoList(List<Pin> pins) {
        return pins.stream()
                .map(PinMapper.INSTANCE::pinToPinGetDto)
                .toList();
    }

    private Pin mapCreatePinDtoToPin(PinCreateDto pinCreateDto, UserData user) {
        Pin pin = PinMapper.INSTANCE.pinCreateDtoToPin(pinCreateDto);
        pin.setUser(user);
        return pin;
    }
}
