package com.citystories.backend.controller;

import com.citystories.backend.domain.dto.challenge.ChallengeCreateDto;
import com.citystories.backend.domain.dto.challenge.ChallengeGetDto;
import com.citystories.backend.service.ChallengeService;
import com.citystories.backend.service.impl.ChallengeServiceImpl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/challenges")
public class ChallengeController {
    private final ChallengeService challengeService;

    public ChallengeController(ChallengeServiceImpl challengeService) {
        this.challengeService = challengeService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<ChallengeGetDto> getChallengeById(@PathVariable Long id) {
        return ResponseEntity.status(HttpStatus.OK).body(challengeService.getChallenge(id));
    }

    @GetMapping
    public ResponseEntity<ChallengeGetDto> getActiveChallenge(){
        return ResponseEntity.status(HttpStatus.OK).body(challengeService.getActiveChallenge());
    }

//    @GetMapping
//    public ResponseEntity<List<ChallengeGetDto>> getAllChallenges() {
//        return ResponseEntity.status(HttpStatus.OK).body(challengeService.getAllChallenges());
//    }

    @PostMapping
    public ResponseEntity<ChallengeGetDto> createChallenge(@RequestBody ChallengeCreateDto challengeCreateDto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(challengeService.createChallenge(challengeCreateDto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ChallengeGetDto> updateChallenge(
            @PathVariable Long id,
            @RequestBody ChallengeCreateDto challengeCreateDto) {
        return ResponseEntity.status(HttpStatus.OK).body(challengeService.updateChallenge(id, challengeCreateDto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteChallenge(@PathVariable Long id) {
        challengeService.deleteChallenge(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}
