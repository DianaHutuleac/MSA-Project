package com.citystories.demo.mapper;

import com.citystories.demo.domain.dto.comment.CommentCreateDto;
import com.citystories.demo.domain.dto.comment.CommentGetDto;
import com.citystories.demo.domain.entity.Comment;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper
public interface CommentMapper {
    CommentMapper INSTANCE = Mappers.getMapper(CommentMapper.class);

    CommentGetDto commentToCommentGetDto(Comment comment);
    Comment commentCreateDtoToComment(CommentCreateDto commentCreateDto);
}
