package com.citystories.backend.service;

import com.citystories.backend.domain.dto.user.UserCreateDto;
import com.citystories.backend.domain.dto.user.UserGetDto;
import com.citystories.backend.domain.dto.user.UserLogInDto;

public interface UserDataService {
    UserGetDto registerUser(UserCreateDto userCreateDto);
    UserGetDto loginUser(UserLogInDto userLogInDto);
}
