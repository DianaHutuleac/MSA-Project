package com.citystories.backend.domain.dto.pin;

import com.citystories.backend.domain.enums.VisibilityDuration;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PinCreateDto {
    private Long userId;
    private String story;
    private VisibilityDuration visibilityDuration; // the enum field
    private Double latitude;
    private Double longitude;
    private Long challengeId;
}
