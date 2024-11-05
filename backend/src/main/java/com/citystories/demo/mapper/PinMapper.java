package com.citystories.demo.mapper;

import com.citystories.demo.domain.dto.pin.PinCreateDto;
import com.citystories.demo.domain.dto.pin.PinGetDto;
import com.citystories.demo.domain.entity.Pin;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper
public interface PinMapper {
    PinMapper INSTANCE = Mappers.getMapper(PinMapper.class);

    Pin pinCreateDtoToPin(PinCreateDto pinCreateDto);
    PinGetDto pinToPinGetDto(Pin pin);
}
