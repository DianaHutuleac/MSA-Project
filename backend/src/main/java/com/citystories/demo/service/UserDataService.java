package com.citystories.demo.service;

import com.citystories.demo.domain.dto.user.UserCreateDto;
import com.citystories.demo.domain.dto.user.UserGetDto;
import com.citystories.demo.domain.entity.UserData;
import com.citystories.demo.mapper.UserDataMapper;
import com.citystories.demo.repository.UserDataRepository;
import org.springframework.stereotype.Service;

@Service
public class UserDataService {
    private final UserDataRepository userDataRepository;

    public UserDataService(UserDataRepository userDataRepository) {
        this.userDataRepository = userDataRepository;
    }

    public UserGetDto createUser(UserCreateDto userCreateDto) {
        UserData user = UserDataMapper.INSTANCE.userCreateDtoToUserData(userCreateDto);
        UserData savedUser = userDataRepository.save(user);
        return UserDataMapper.INSTANCE.userToUserGetDto(savedUser);
    }
}
