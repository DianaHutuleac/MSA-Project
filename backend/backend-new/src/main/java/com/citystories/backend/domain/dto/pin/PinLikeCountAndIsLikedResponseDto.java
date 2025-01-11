package com.citystories.backend.domain.dto.pin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PinLikeCountAndIsLikedResponseDto {
    private boolean liked;
    private Long numberOfLikes;
}
