package com.citystories.backend.service.impl;


import com.citystories.backend.domain.dto.pin.PinCreateDto;
import com.citystories.backend.domain.dto.pin.PinEditDto;
import com.citystories.backend.domain.dto.pin.PinLikeCountAndIsLikedResponseDto;
import com.citystories.backend.domain.dto.pin.PinResponseDto;
import com.citystories.backend.domain.entity.Challenge;
import com.citystories.backend.domain.entity.Pin;
import com.citystories.backend.domain.entity.UserData;
import com.citystories.backend.exception.ChallengeNotFoundException;
import com.citystories.backend.exception.PinNotFoundException;
import com.citystories.backend.exception.UserNotFoundException;
import com.citystories.backend.mapper.PinMapper;
import com.citystories.backend.repository.ChallengeRepository;
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
    private final ChallengeRepository challengeRepository;

    public PinServiceImpl(PinRepository pinRepository, UserDataRepository userDataRepository, ChallengeRepository challengeRepository) {
        this.pinRepository = pinRepository;
        this.userDataRepository = userDataRepository;
        this.challengeRepository = challengeRepository;
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
        String authenticatedUserId = SecurityContextHolder.getContext().getAuthentication().getName();

        if (authenticatedUserId == null) {
            throw new UserNotFoundException("User ID is not available in the SecurityContext.");
        }

        pinCreateDto.setUserId(Long.parseLong(authenticatedUserId));

        UserData user = findUserById(pinCreateDto.getUserId());

        Pin pin = mapCreatePinDtoToPin(pinCreateDto, user);

        if (pin.isChallengePin() && pinCreateDto.getChallengeId() != null) {
            Challenge challenge = findChallengeById(pinCreateDto.getChallengeId());
            pin.setChallenge(challenge);
            pin.setExpiresAt(challenge.getEndDate()); // Match challenge end date
        } else {
            pin.setChallenge(null);
        }

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

        pin.getLikedBy().forEach(user -> user.getLikedPins().remove(pin));
        pin.getLikedBy().clear();

        pinRepository.delete(pin);
    }

    @Scheduled(cron = "0 0 0 * * ?")
    @Override
    public void deleteExpiredPins() {
        LocalDateTime now = LocalDateTime.now();

        // Find all expired pins
        List<Pin> expiredPins = pinRepository.findByExpiresAtBeforeAndExpiresAtIsNotNull(now);

        // Clear relationships for each expired pin
        expiredPins.forEach(pin -> {
            pin.getLikedBy().forEach(user -> user.getLikedPins().remove(pin));
            pin.getLikedBy().clear();
        });

        // Delete expired pins
        pinRepository.deleteAll(expiredPins);
    }

    @Transactional
    @Override
    public PinResponseDto addLikeToPin(Long pinId) {
        // Extract authenticated user ID from the SecurityContext
        String authenticatedUserId = SecurityContextHolder.getContext().getAuthentication().getName();
        if (authenticatedUserId == null) {
            throw new UserNotFoundException("User ID is not available in the SecurityContext.");
        }

        Long userId = Long.parseLong(authenticatedUserId);
        UserData user = findUserById(userId);
        Pin pin = findPinById(pinId);

        if (!pin.getLikedBy().contains(user)) {
            pin.getLikedBy().add(user);
            user.getLikedPins().add(pin);
            pin.setNumberOfLikes(pin.getNumberOfLikes() + 1);
            pinRepository.save(pin);
            userDataRepository.save(user);
        }

        return mapToResponseDto(pin);
    }


    @Transactional
    @Override
    public PinResponseDto removeLikeFromPin(Long pinId) {
        // Extract authenticated user ID from the SecurityContext
        String authenticatedUserId = SecurityContextHolder.getContext().getAuthentication().getName();
        if (authenticatedUserId == null) {
            throw new UserNotFoundException("User ID is not available in the SecurityContext.");
        }

        Long userId = Long.parseLong(authenticatedUserId);
        UserData user = findUserById(userId);
        Pin pin = findPinById(pinId);

        if (pin.getLikedBy().contains(user)) {
            pin.getLikedBy().remove(user);
            user.getLikedPins().remove(pin);
            pin.setNumberOfLikes(pin.getNumberOfLikes() - 1);
            pinRepository.save(pin);
            userDataRepository.save(user);
        }

        return mapToResponseDto(pin);
    }

    @Override
    public PinLikeCountAndIsLikedResponseDto getPinLikeCountAndIsLiked(Long pinId) {
        // Extract authenticated user ID from the SecurityContext
        String authenticatedUserId = SecurityContextHolder.getContext().getAuthentication().getName();
        System.out.println("Authenticated User ID: " + authenticatedUserId); // Debug log
        if (authenticatedUserId == null) {
            throw new UserNotFoundException("User ID is not available in the SecurityContext.");
        }

        Long userId = Long.parseLong(authenticatedUserId);
        UserData user = findUserById(userId);
        Pin pin = findPinById(pinId);

        boolean liked = pin.getLikedBy().contains(user);
        System.out.println("User " + userId + " liked pin " + pinId + ": " + liked); // Debug log
//        System.out.println(pin.getLikedBy()); // Debug log

        return PinLikeCountAndIsLikedResponseDto.builder()
                .liked(liked)
                .numberOfLikes((long) pin.getNumberOfLikes())
                .build();
    }

    @Override
    public List<PinResponseDto> getPinsLikedByUser(Long userId) {
        // Find the user
        UserData user = findUserById(userId);

        // Get the list of liked pins
        List<Pin> likedPins = user.getLikedPins();

        // Map to PinResponseDto and return
        return mapToResponseDtoList(likedPins);
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

    private Challenge findChallengeById(Long challengeId) {
        return challengeRepository.findById(challengeId)
                .orElseThrow(() -> new ChallengeNotFoundException("Challenge with id " + challengeId + " not found"));
    }
}
