package com.citystories.backend.domain.dto.pin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PinGetDto {
    private Long id;
    private String story;
    private Long numberOfLikes;
    private LocalDateTime createdAt;
}