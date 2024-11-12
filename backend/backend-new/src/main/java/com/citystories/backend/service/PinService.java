package com.citystories.backend.service;

import com.citystories.backend.domain.dto.pin.PinCreateDto;
import com.citystories.backend.domain.dto.pin.PinEditDto;
import com.citystories.backend.domain.dto.pin.PinGetDto;

public interface PinService {
    PinGetDto createPin(PinCreateDto pinCreateDto);
    PinGetDto getPin(Long id);
    PinGetDto updatePin(Long id, PinEditDto pinEditDto);
    void deletePin(Long id);
    void deleteExpiredPins();
}
