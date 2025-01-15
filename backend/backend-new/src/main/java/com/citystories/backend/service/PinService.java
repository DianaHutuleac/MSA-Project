package com.citystories.backend.service;

import com.citystories.backend.domain.dto.pin.PinCreateDto;
import com.citystories.backend.domain.dto.pin.PinEditDto;
import com.citystories.backend.domain.dto.pin.PinLikeCountAndIsLikedResponseDto;
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
    PinResponseDto addLikeToPin(Long id);
    PinResponseDto removeLikeFromPin(Long id);
    PinResponseDto getPinByUserId(Long userId);
    PinLikeCountAndIsLikedResponseDto getPinLikeCountAndIsLiked(Long pinId);
    List<PinResponseDto> getPinsLikedByUser(Long userId);
}
