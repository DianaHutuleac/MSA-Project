package com.citystories.backend.service.impl;

import com.citystories.backend.domain.dto.challenge.ChallengeCreateDto;
import com.citystories.backend.domain.dto.challenge.ChallengeGetDto;
import com.citystories.backend.domain.dto.pin.PinResponseDto;
import com.citystories.backend.domain.entity.Challenge;
import com.citystories.backend.domain.entity.Pin;
import com.citystories.backend.domain.enums.VisibilityDuration;
import com.citystories.backend.exception.ChallengeNotFoundException;
import com.citystories.backend.exception.PinNotFoundException;
import com.citystories.backend.mapper.ChallengeMapper;
import com.citystories.backend.mapper.PinMapper;
import com.citystories.backend.repository.ChallengeRepository;
import com.citystories.backend.repository.PinRepository;
import com.citystories.backend.service.ChallengeService;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;

@Service
public class ChallengeServiceImpl implements ChallengeService {

    private final ChallengeRepository challengeRepository;
    private final PinRepository pinRepository;

    public ChallengeServiceImpl(ChallengeRepository challengeRepository, PinRepository pinRepository) {
        this.challengeRepository = challengeRepository;
        this.pinRepository = pinRepository;
    }

    @Override
    public ChallengeGetDto getChallenge(Long challengeId) {
        Challenge challenge = findChallengeById(challengeId);
        return ChallengeMapper.INSTANCE.toChallengeGetDto(challenge);
    }

    @Override
    public ChallengeGetDto getActiveChallenge() {
        LocalDateTime currentDate = LocalDateTime.now();
        // Example custom method in the repo:
        //   findActiveChallenge(...) => unprocessed challenge with
        //   startDate <= now and endDate > now
        Challenge activeChallenge = challengeRepository.findActiveChallenge(currentDate)
                .orElseThrow(() -> new ChallengeNotFoundException("No active challenge found"));
        return ChallengeMapper.INSTANCE.toChallengeGetDto(activeChallenge);
    }

    @Override
    public ChallengeGetDto createChallenge(ChallengeCreateDto challengeCreateDto) {
        Challenge challenge = ChallengeMapper.INSTANCE.toChallenge(challengeCreateDto);
        Challenge saved = challengeRepository.save(challenge);
        return ChallengeMapper.INSTANCE.toChallengeGetDto(saved);
    }

    @Override
    public ChallengeGetDto updateChallenge(Long challengeId, ChallengeCreateDto challengeCreateDto) {
        Challenge challenge = findChallengeById(challengeId);

        challenge.setTheme(challengeCreateDto.getTheme());
        if (challengeCreateDto.getStartDate() != null) {
            challenge.setStartDate(challengeCreateDto.getStartDate());
        }

        Challenge updated = challengeRepository.save(challenge);
        return ChallengeMapper.INSTANCE.toChallengeGetDto(updated);
    }

    @Override
    public void deleteChallenge(Long challengeId) {
        Challenge challenge = findChallengeById(challengeId);
        challengeRepository.delete(challenge);
    }

    /**
     * Process the most recently ended challenge that is still unprocessed.
     * 1) Find challenge that ended and is not processed
     * 2) Identify the winner (pin with max likes)
     * 3) Set the winner to expire in 1 week (example logic)
     * 4) Delete other pins
     * 5) Save winningPin, mark challenge as processed, set winningPin in challenge
     */
    @Transactional
    @Override
    public PinResponseDto processPreviousChallenge() {
        LocalDateTime now = LocalDateTime.now();

        // 1) Find challenge that ended (endDate <= now) and is not processed
        Challenge previousChallenge = challengeRepository.findUnprocessedChallengeBefore(now)
                .orElseThrow(() -> new ChallengeNotFoundException(
                        "No previous challenge found that ended and is unprocessed"));

        // 2) Retrieve all pins for that challenge
        List<Pin> challengePins = pinRepository.findByChallengeId(previousChallenge.getId());
        if (challengePins.isEmpty()) {
            // Mark processed so we don't keep re-finding this challenge
            previousChallenge.setProcessed(true);
            challengeRepository.save(previousChallenge);
            throw new PinNotFoundException("No pins found for the ended challenge");
        }

        // 3) Find the pin with the most likes
        Pin winningPin = challengePins.stream()
                .max(Comparator.comparingInt(Pin::getNumberOfLikes))
                .orElseThrow(() -> new PinNotFoundException("No pins found for the ended challenge"));

        // 4) Adjust the winning pin (example: make it last 1 more week)
        winningPin.setExpiresAt(now.plusWeeks(1));
        winningPin.setVisibilityDuration(VisibilityDuration.WEEK);
        pinRepository.save(winningPin);

        // 5) Delete all non-winning pins
        challengePins.stream()
                .filter(pin -> !pin.equals(winningPin))
                .forEach(pinRepository::delete);

        // 6) Mark challenge as processed & set the winner
        previousChallenge.setProcessed(true);
        previousChallenge.setWinningPin(winningPin);
        challengeRepository.save(previousChallenge);

        return mapToResponseDto(winningPin);
    }

    /**
     * Returns the winning pin of a processed challenge by challengeId.
     * If the challenge is not yet processed or no winner, throws an exception.
     */
    @Override
    public PinResponseDto getChallengeWinner(Long challengeId) {
        Challenge challenge = findChallengeById(challengeId);
        if (!challenge.isProcessed() || challenge.getWinningPin() == null) {
            throw new ChallengeNotFoundException("Challenge not processed or no winner available");
        }
        return mapToResponseDto(challenge.getWinningPin());
    }

    @Override
    public PinResponseDto getLastProcessedChallengeWinner() {
        Challenge challenge = challengeRepository.findLastProcessedChallenge()
                .orElseThrow(() -> new ChallengeNotFoundException("No processed challenge found"));

        if (challenge.getWinningPin() == null) {
            throw new PinNotFoundException("No winner found in last processed challenge");
        }
        return mapToResponseDto(challenge.getWinningPin());
    }


    private PinResponseDto mapToResponseDto(Pin pin) {
        return PinMapper.INSTANCE.pinToPinGetDto(pin);
    }

    private Challenge findChallengeById(Long challengeId) {
        return challengeRepository.findById(challengeId)
                .orElseThrow(() -> new ChallengeNotFoundException(
                        "Challenge with id " + challengeId + " not found"));
    }
}
