package com.citystories.backend.controller;

import com.citystories.backend.domain.dto.pin.PinCreateDto;
import com.citystories.backend.domain.dto.pin.PinGetDto;
import com.citystories.backend.service.PinService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/pins")
public class PinController {
    private final PinService pinService;

    public PinController(PinService pinService) {
        this.pinService = pinService;
    }

    @PostMapping
    public ResponseEntity<PinGetDto> createPin(@RequestBody PinCreateDto pinCreateDto) {
        PinGetDto pinGetDto = pinService.createPin(pinCreateDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(pinGetDto);
    }
}
