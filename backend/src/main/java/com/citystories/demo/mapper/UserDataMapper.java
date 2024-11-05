package com.citystories.demo.mapper;

import com.citystories.demo.domain.dto.user.UserCreateDto;
import com.citystories.demo.domain.dto.user.UserGetDto;
import com.citystories.demo.domain.entity.UserData;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper
public interface UserDataMapper {
    UserDataMapper INSTANCE = Mappers.getMapper(UserDataMapper.class);

    UserGetDto userToUserGetDto(UserData user);
    UserData userCreateDtoToUserData(UserCreateDto userCreateDto);
}
