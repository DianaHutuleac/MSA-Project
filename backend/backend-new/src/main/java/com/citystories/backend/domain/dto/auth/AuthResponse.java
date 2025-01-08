package com.citystories.backend.domain.dto.auth;

import com.citystories.backend.domain.dto.user.UserGetDto;

public class AuthResponse {
    private String token;
    private UserGetDto user;

    public AuthResponse() {
    }

    public AuthResponse(String token, UserGetDto user) {
        this.token = token;
        this.user = user;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public UserGetDto getUser() {
        return user;
    }

    public void setUser(UserGetDto user) {
        this.user = user;
    }
}
