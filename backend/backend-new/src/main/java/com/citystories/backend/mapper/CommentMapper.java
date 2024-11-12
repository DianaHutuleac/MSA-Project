package com.citystories.backend.mapper;


import com.citystories.backend.domain.dto.comment.CommentCreateDto;
import com.citystories.backend.domain.dto.comment.CommentGetDto;
import com.citystories.backend.domain.entity.Comment;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper
public interface CommentMapper {
    CommentMapper INSTANCE = Mappers.getMapper(CommentMapper.class);

    CommentGetDto commentToCommentGetDto(Comment comment);
    Comment commentCreateDtoToComment(CommentCreateDto commentCreateDto);
}
