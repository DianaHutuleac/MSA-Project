package com.citystories.backend.domain.dto.challenge;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ChallengeGetDto {
    private Long id;
    private String theme;
}
