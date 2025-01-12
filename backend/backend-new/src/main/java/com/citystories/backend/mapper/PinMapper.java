package com.citystories.backend.mapper;


import com.citystories.backend.domain.dto.pin.PinCreateDto;
import com.citystories.backend.domain.dto.pin.PinEditDto;
import com.citystories.backend.domain.dto.pin.PinResponseDto;
import com.citystories.backend.domain.entity.Pin;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper
public interface PinMapper {
    PinMapper INSTANCE = Mappers.getMapper(PinMapper.class);

    @Mapping(target = "user.id", source = "userId")
    @Mapping(target = "challenge.id", source = "challengeId")
    Pin pinCreateDtoToPin(PinCreateDto pinCreateDto);

    Pin pinEditDtoToPin(PinEditDto pinEditDto);
    PinResponseDto pinToPinGetDto(Pin pin);
}
