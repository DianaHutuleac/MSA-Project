package com.citystories.backend.mapper;


import com.citystories.backend.domain.dto.pin.PinCreateDto;
import com.citystories.backend.domain.dto.pin.PinGetDto;
import com.citystories.backend.domain.entity.Pin;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper
public interface PinMapper {
    PinMapper INSTANCE = Mappers.getMapper(PinMapper.class);

    Pin pinCreateDtoToPin(PinCreateDto pinCreateDto);
    PinGetDto pinToPinGetDto(Pin pin);
}
