package com.citystories.backend.service.impl;


import com.citystories.backend.domain.dto.user.UserCreateDto;
import com.citystories.backend.domain.dto.user.UserGetDto;
import com.citystories.backend.domain.dto.user.UserLogInDto;
import com.citystories.backend.domain.entity.UserData;
import com.citystories.backend.exception.UserNotFoundException;
import com.citystories.backend.exception.UserPasswordIncorrectException;
import com.citystories.backend.mapper.UserDataMapper;
import com.citystories.backend.repository.UserDataRepository;
import com.citystories.backend.service.UserDataService;
import org.springframework.stereotype.Service;

@Service
public class UserDataServiceImpl implements UserDataService {
    private final UserDataRepository userDataRepository;

    public UserDataServiceImpl(UserDataRepository userDataRepository) {
        this.userDataRepository = userDataRepository;
    }

    @Override
    public UserGetDto registerUser(UserCreateDto userCreateDto) {
        UserData user = UserDataMapper.INSTANCE.userCreateDtoToUserData(userCreateDto);
        UserData savedUser = userDataRepository.save(user);
        return UserDataMapper.INSTANCE.userToUserGetDto(savedUser);
    }

    @Override
    public UserGetDto loginUser(UserLogInDto userLogInDto) {
        UserData user = userDataRepository.findUserDataByEmail(userLogInDto.getEmail())
                .orElseThrow(() -> new UserNotFoundException("Cannot find user with email " + userLogInDto.getEmail()));

        String password = userLogInDto.getPassword();
        String userSavedPassword = user.getPassword();

        if (!password.equals(userSavedPassword)) {
            throw new UserPasswordIncorrectException("Cannot find user with email " + userLogInDto.getEmail());
        }

        return UserDataMapper.INSTANCE.userToUserGetDto(user);
    }
}
