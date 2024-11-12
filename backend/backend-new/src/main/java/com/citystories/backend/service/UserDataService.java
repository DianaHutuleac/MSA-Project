package com.citystories.backend.service;


import com.citystories.backend.domain.dto.user.UserCreateDto;
import com.citystories.backend.domain.dto.user.UserGetDto;
import com.citystories.backend.domain.entity.UserData;
import com.citystories.backend.mapper.UserDataMapper;
import com.citystories.backend.repository.UserDataRepository;
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
