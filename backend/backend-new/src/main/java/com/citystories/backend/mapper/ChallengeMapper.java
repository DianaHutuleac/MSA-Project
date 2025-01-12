package com.citystories.backend.mapper;

import com.citystories.backend.domain.dto.challenge.ChallengeCreateDto;
import com.citystories.backend.domain.dto.challenge.ChallengeGetDto;
import com.citystories.backend.domain.entity.Challenge;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper
public interface ChallengeMapper {
    ChallengeMapper INSTANCE = Mappers.getMapper(ChallengeMapper.class);

    ChallengeGetDto toChallengeGetDto(Challenge entity);

    Challenge toChallenge(ChallengeCreateDto dto);
}
