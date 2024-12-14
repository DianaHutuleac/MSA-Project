package com.citystories.backend.service;

import com.citystories.backend.domain.dto.pin.PinCreateDto;
import com.citystories.backend.domain.dto.pin.PinEditDto;
import com.citystories.backend.domain.dto.pin.PinResponseDto;

import java.util.List;

public interface PinService {
    PinResponseDto createPin(PinCreateDto pinCreateDto);
    PinResponseDto getPin(Long id);
    List<PinResponseDto> getAllPins();
    List<PinResponseDto> getAllPinsForUser(Long userId);
    PinResponseDto updatePin(Long id, PinEditDto pinEditDto);
    void deletePin(Long id);
    void deleteExpiredPins();
    PinResponseDto getPinByUserId(Long userId);
}
