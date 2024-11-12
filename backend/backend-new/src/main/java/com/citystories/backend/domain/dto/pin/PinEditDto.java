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
public class PinEditDto {
    private Long id;
    private String story;
    private VisibilityDuration visibilityDuration; // the enum field
}
