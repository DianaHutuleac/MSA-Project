package com.citystories.demo.domain.dto.comment;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CommentGetDto {
    private Long id;
    private String content;
    private LocalDateTime createdAt;
    private Long pinId;
    private Long userId;
}
