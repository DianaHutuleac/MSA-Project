package com.citystories.backend.domain.dto.challenge;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ChallengeCreateDto {
    private String theme;
    private LocalDateTime startDate;
}
