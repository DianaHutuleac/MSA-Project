package com.citystories.backend.domain.dto.pin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ChallengePinCreateDto {
    private String story;         // The story for the pin
    private Double latitude;      // Latitude for map placement
    private Double longitude;     // Longitude for map placement
    private Long userId;          // User submitting the pin
    private Long challengeId;     // The ID of the associated challenge
}
