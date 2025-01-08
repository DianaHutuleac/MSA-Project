package com.citystories.backend.controller;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.citystories.backend.domain.dto.user.UserCreateDto;
import com.citystories.backend.domain.dto.user.UserGetDto;
import com.citystories.backend.domain.dto.user.UserLogInDto;
import com.citystories.backend.service.UserDataService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/user")
public class UserController {
    private final UserDataService userDataService;

    // Choose a secret key that’s long and secure.
    // In production, store it outside of your code (e.g., environment variables)
    private static final String SECRET_KEY = "MY_SUPER_SECRET_KEY_123456";

    public UserController(UserDataService userDataService) {
        this.userDataService = userDataService;
    }

    @PostMapping("/register")
    public ResponseEntity<UserGetDto> registerUser(@RequestBody UserCreateDto userCreateDto) {
        return new ResponseEntity<>(userDataService.registerUser(userCreateDto), HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> loginUser(@RequestBody UserLogInDto userLogInDto) {
        // 1. Validate credentials with your service
        // (Make sure the user exists, password matches, etc.)
        UserGetDto foundUser = userDataService.loginUser(userLogInDto);

        // If user is invalid, you can throw an exception or return 401
        // For example:
        if (foundUser == null) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Invalid credentials");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
        }

        // 2. Generate JWT Token
        String token = generateToken(foundUser);

        // 3. Return the token
        Map<String, String> response = new HashMap<>();
        response.put("token", token);
        return ResponseEntity.ok(response);
    }

    private String generateToken(UserGetDto user) {
        // Expiration in milliseconds (e.g., 1 hour = 3600000ms)
        long expirationTimeMillis = 3600000;
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expirationTimeMillis);

        return JWT.create()
                .withSubject(String.valueOf(user.getId()))   // or user email, etc.
                .withClaim("email", user.getEmail())
                // Add more claims if needed
                .withIssuedAt(now)
                .withExpiresAt(expiryDate)
                .sign(Algorithm.HMAC256(SECRET_KEY)); // sign with secret key using HS256
    }
}
