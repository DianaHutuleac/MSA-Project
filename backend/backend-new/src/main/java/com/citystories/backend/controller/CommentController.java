package com.citystories.backend.controller;

import com.citystories.backend.domain.dto.comment.CommentCreateDto;
import com.citystories.backend.domain.dto.comment.CommentGetDto;
import com.citystories.backend.service.CommentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/comments")
public class CommentController {
    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<CommentGetDto> getCommentById(@PathVariable Long id) {
        return ResponseEntity.status(HttpStatus.OK).body(commentService.getCommentById(id));
    }

    @GetMapping("comments-for-pin/{pinId}")
    public ResponseEntity<List<CommentGetDto>> getAllCommentsForPin(@PathVariable Long pinId) {
        return ResponseEntity.status(HttpStatus.OK).body(commentService.getAllCommentsForPin(pinId));
    }

    @GetMapping("comments-for-user/{userId}")
    public ResponseEntity<List<CommentGetDto>> getAllCommentsForUser(@PathVariable Long userId) {
        return ResponseEntity.status(HttpStatus.OK).body(commentService.getAllCommentsForUser(userId));
    }

    @PostMapping
    public ResponseEntity<CommentGetDto> createComment(@RequestBody CommentCreateDto commentCreateDto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(commentService.createComment(commentCreateDto));
    }
}