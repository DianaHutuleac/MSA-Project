package com.citystories.backend.service;

import com.citystories.backend.domain.dto.auth.AuthResponse;
import com.citystories.backend.domain.dto.user.UserCreateDto;
import com.citystories.backend.domain.dto.user.UserLogInDto;

public interface UserDataService {
    AuthResponse registerUser(UserCreateDto userCreateDto);
    AuthResponse loginUser(UserLogInDto userLogInDto);
}
