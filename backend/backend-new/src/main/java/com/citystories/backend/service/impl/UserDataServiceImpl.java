package com.citystories.backend.service.impl;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.citystories.backend.domain.dto.auth.AuthResponse;
import com.citystories.backend.domain.dto.user.UserCreateDto;
import com.citystories.backend.domain.dto.user.UserGetDto;
import com.citystories.backend.domain.dto.user.UserLogInDto;
import com.citystories.backend.domain.entity.UserData;
import com.citystories.backend.exception.UserNotFoundException;
import com.citystories.backend.exception.UserPasswordIncorrectException;
import com.citystories.backend.mapper.UserDataMapper;
import com.citystories.backend.repository.UserDataRepository;
import com.citystories.backend.service.UserDataService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class UserDataServiceImpl implements UserDataService {

    private static final String SECRET_KEY = "MY_SUPER_SECRET_KEY_123456";
    private final UserDataRepository userDataRepository;
    private final PasswordEncoder passwordEncoder; // Injected

    public UserDataServiceImpl(UserDataRepository userDataRepository,
                               PasswordEncoder passwordEncoder) {
        this.userDataRepository = userDataRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public AuthResponse registerUser(UserCreateDto userCreateDto) {
        // 1. Convert DTO to entity
        UserData user = UserDataMapper.INSTANCE.userCreateDtoToUserData(userCreateDto);

        // 2. Hash the raw password before saving
        String hashedPassword = passwordEncoder.encode(userCreateDto.getPassword());
        user.setPassword(hashedPassword);

        // 3. Save user
        UserData savedUser = userDataRepository.save(user);

        // 4. Generate JWT
        String token = generateJwtToken(savedUser);

        // 5. Convert to UserGetDto
        UserGetDto userGetDto = UserDataMapper.INSTANCE.userToUserGetDto(savedUser);

        // 6. Return AuthResponse with JWT + user data
        return new AuthResponse(token, userGetDto);
    }

    @Override
    public AuthResponse loginUser(UserLogInDto userLogInDto) {
        // 1. Find user by email
        UserData user = userDataRepository.findUserDataByEmail(userLogInDto.getEmail())
                .orElseThrow(() -> new UserNotFoundException(
                        "Cannot find user with email " + userLogInDto.getEmail()
                ));

        // 2. Verify password using passwordEncoder
        if (!passwordEncoder.matches(userLogInDto.getPassword(), user.getPassword())) {
            throw new UserPasswordIncorrectException("Incorrect password for " + userLogInDto.getEmail());
        }

        // 3. Generate JWT
        String token = generateJwtToken(user);

        // 4. Convert user to DTO
        UserGetDto userGetDto = UserDataMapper.INSTANCE.userToUserGetDto(user);

        // 5. Return token + user data
        return new AuthResponse(token, userGetDto);
    }

    private String generateJwtToken(UserData user) {
        // Subject = user ID (or email). Add any claims you need
        return JWT.create()
                .withSubject(String.valueOf(user.getId()))
                .withClaim("email", user.getEmail())
                // Example: 1 day expiration (86,400,000 ms)
                .withExpiresAt(new Date(System.currentTimeMillis() + 86_400_000))
                .sign(Algorithm.HMAC256(SECRET_KEY));
    }
}
