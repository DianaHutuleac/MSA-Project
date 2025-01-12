package com.citystories.backend.service;

import com.citystories.backend.domain.dto.comment.CommentCreateDto;
import com.citystories.backend.domain.dto.comment.CommentGetDto;

import java.util.List;

public interface CommentService {
    CommentGetDto getCommentById(Long id);
    CommentGetDto createComment(CommentCreateDto commentCreateDto);
    List<CommentGetDto> getAllCommentsForPin(Long pinId);
    List<CommentGetDto> getAllCommentsForUser(Long userId);
    void deleteCommentById(Long id);
}
