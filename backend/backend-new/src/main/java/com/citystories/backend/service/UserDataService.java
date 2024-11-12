package com.citystories.backend.service;

import com.citystories.backend.domain.dto.user.UserCreateDto;
import com.citystories.backend.domain.dto.user.UserGetDto;

public interface UserDataService {
    UserGetDto createUser(UserCreateDto userCreateDto);
}
