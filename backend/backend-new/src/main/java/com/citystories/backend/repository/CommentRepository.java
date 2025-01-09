package com.citystories.backend.repository;


import com.citystories.backend.domain.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> getAllByPinId(Long pinId);
    List<Comment> getAllByUserId(Long userId);
}
