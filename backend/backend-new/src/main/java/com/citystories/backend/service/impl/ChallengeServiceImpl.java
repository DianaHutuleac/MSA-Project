package com.citystories.backend.service.impl;

import com.citystories.backend.domain.dto.challenge.ChallengeCreateDto;
import com.citystories.backend.domain.dto.challenge.ChallengeGetDto;
import com.citystories.backend.domain.entity.Challenge;
import com.citystories.backend.exception.ChallengeNotFoundException;
import com.citystories.backend.mapper.ChallengeMapper;
import com.citystories.backend.repository.ChallengeRepository;
import com.citystories.backend.service.ChallengeService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class ChallengeServiceImpl implements ChallengeService {
    private final ChallengeRepository challengeRepository;

    public ChallengeServiceImpl(ChallengeRepository challengeRepository) {
        this.challengeRepository = challengeRepository;
    }

    @Override
    public ChallengeGetDto getChallenge(Long challengeId) {
        Challenge challenge = findChallengeById(challengeId);
        return ChallengeMapper.INSTANCE.toChallengeGetDto(challenge);
    }

    @Override
    public ChallengeGetDto getActiveChallenge() {
        LocalDateTime currentDate = LocalDateTime.now();
        Challenge activeChallenge = challengeRepository.findActiveChallenge(currentDate)
                .orElseThrow(() -> new ChallengeNotFoundException("No active challenge found"));
        return ChallengeMapper.INSTANCE.toChallengeGetDto(activeChallenge);
    }

    @Override
    public ChallengeGetDto createChallenge(ChallengeCreateDto challengeCreateDto) {
        Challenge challenge = ChallengeMapper.INSTANCE.toChallenge(challengeCreateDto);
        return ChallengeMapper.INSTANCE.toChallengeGetDto(challengeRepository.save(challenge));
    }

    @Override
    public ChallengeGetDto updateChallenge(Long challengeId, ChallengeCreateDto challengeCreateDto) {
        Challenge challenge = findChallengeById(challengeId);

        challenge.setTheme(challengeCreateDto.getTheme());
        if(challengeCreateDto.getStartDate() != null) {
            challenge.setStartDate(challengeCreateDto.getStartDate());
        }

        return ChallengeMapper.INSTANCE.toChallengeGetDto(challengeRepository.save(challenge));
    }

    @Override
    public void deleteChallenge(Long challengeId) {
        Challenge challenge = findChallengeById(challengeId);
        challengeRepository.delete(challenge);
    }

    private Challenge findChallengeById(Long challengeId) {
        return challengeRepository.findById(challengeId)
                .orElseThrow(() -> new ChallengeNotFoundException("Challenge with id " + challengeId + " not found"));
    }
}
