package com.citystories.backend.controller;

import com.citystories.backend.domain.dto.pin.PinCreateDto;
import com.citystories.backend.domain.dto.pin.PinEditDto;
import com.citystories.backend.domain.dto.pin.PinResponseDto;
import com.citystories.backend.service.PinService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/pins")
public class PinController {
    private final PinService pinService;

    public PinController(PinService pinService) {
        this.pinService = pinService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<PinResponseDto> getPinById(@PathVariable Long id) {
        return ResponseEntity.status(HttpStatus.OK).body(pinService.getPin(id));
    }

    @GetMapping("pin-for-user/{userId}")
    public ResponseEntity<PinResponseDto> getPinByUserId(@PathVariable Long userId) {
        return ResponseEntity.status(HttpStatus.OK).body(pinService.getPinByUserId(userId));
    }

    @GetMapping("all-pins-for-user/{userId}")
    public ResponseEntity<List<PinResponseDto>> getAllPinsForUser(@PathVariable Long userId) {
        return ResponseEntity.status(HttpStatus.OK).body(pinService.getAllPinsForUser(userId));
    }

    @GetMapping
    public ResponseEntity<List<PinResponseDto>> getAllPins() {
        return ResponseEntity.status(HttpStatus.OK).body(pinService.getAllPins());
    }

    @PostMapping
    public ResponseEntity<PinResponseDto> createPin(@RequestBody PinCreateDto pinCreateDto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(pinService.createPin(pinCreateDto));
    }

    @PutMapping("/{pinId}")
    public ResponseEntity<PinResponseDto> updatePin(@PathVariable Long pinId, @RequestBody PinEditDto pinEditDto) {
        return ResponseEntity.status(HttpStatus.OK).body(pinService.updatePin(pinId, pinEditDto));
    }

    @PutMapping("/{pinId}/like")
    public ResponseEntity<PinResponseDto> addLikeToPin(@PathVariable Long pinId) {
        return ResponseEntity.status(HttpStatus.OK).body(pinService.addLikeToPin(pinId));
    }

    @PutMapping("/{pinId}/unlike")
    public ResponseEntity<PinResponseDto> removeLikeFromPin(@PathVariable Long pinId) {
        return ResponseEntity.status(HttpStatus.OK).body(pinService.removeLikeFromPin(pinId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deletePin(@PathVariable Long id) {
        pinService.deletePin(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).body("Successfully deleted pin with id: " + id);
    }
}
