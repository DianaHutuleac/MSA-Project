package com.citystories.backend.service;

import com.citystories.backend.domain.dto.challenge.ChallengeCreateDto;
import com.citystories.backend.domain.dto.challenge.ChallengeGetDto;

import java.util.List;

public interface ChallengeService {
//    List<ChallengeGetDto> getChallenges();
    ChallengeGetDto getChallenge(Long challengeId);
    ChallengeGetDto createChallenge(ChallengeCreateDto challengeCreateDto);
    ChallengeGetDto updateChallenge(Long challengeId, ChallengeCreateDto challengeCreateDto);
    void deleteChallenge(Long challengeId);
    ChallengeGetDto getActiveChallenge();
}
