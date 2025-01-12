package com.citystories.backend.service.impl;

import com.citystories.backend.domain.dto.comment.CommentCreateDto;
import com.citystories.backend.domain.dto.comment.CommentGetDto;
import com.citystories.backend.domain.entity.Comment;
import com.citystories.backend.domain.entity.Pin;
import com.citystories.backend.domain.entity.UserData;
import com.citystories.backend.exception.CommentNotFoundException;
import com.citystories.backend.exception.PinNotFoundException;
import com.citystories.backend.mapper.CommentMapper;
import com.citystories.backend.repository.CommentRepository;
import com.citystories.backend.repository.PinRepository;
import com.citystories.backend.repository.UserDataRepository;
import com.citystories.backend.service.CommentService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CommentServiceImpl implements CommentService {
    private final CommentRepository commentRepository;
    private final PinRepository pinRepository;
    private final UserDataRepository userDataRepository;

    public CommentServiceImpl(CommentRepository commentRepository, PinRepository pinRepository, UserDataRepository userDataRepository) {
        this.commentRepository = commentRepository;
        this.pinRepository = pinRepository;
        this.userDataRepository = userDataRepository;
    }

    @Override
    public CommentGetDto getCommentById(Long id) {
        Comment comment = findCommentById(id);

        return CommentMapper.INSTANCE.commentToCommentGetDto(comment);
    }

    @Override
    public CommentGetDto createComment(CommentCreateDto commentCreateDto) {
        Pin pin = pinRepository.findById(commentCreateDto.getPinId())
                .orElseThrow(() -> new PinNotFoundException("Pin " + commentCreateDto.getPinId() + " not found"));
        UserData userData = userDataRepository.findById(commentCreateDto.getUserId())
                .orElseThrow(() -> new PinNotFoundException("User " + commentCreateDto.getUserId() + " not found"));

        Comment comment = CommentMapper.INSTANCE.commentCreateDtoToComment(commentCreateDto);

        Comment savedComment = commentRepository.save(comment);

        return CommentMapper.INSTANCE.commentToCommentGetDto(savedComment);
    }

    @Override
    public List<CommentGetDto> getAllCommentsForPin(Long pinId) {
        return commentRepository.getAllByPinId(pinId).stream()
                .map(CommentMapper.INSTANCE::commentToCommentGetDto)
                .toList();
    }

    @Override
    public List<CommentGetDto> getAllCommentsForUser(Long userId) {
        return commentRepository.getAllByUserId(userId).stream()
                .map(CommentMapper.INSTANCE::commentToCommentGetDto)
                .toList();
    }

    @Override
    public void deleteCommentById(Long id) {
        findCommentById(id);
        commentRepository.deleteById(id);
    }

    private Comment findCommentById(Long id) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new CommentNotFoundException("Comment with id " + id + " not found"));
        return comment;
    }
}
