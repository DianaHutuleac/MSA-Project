package com.citystories.backend.mapper;


import com.citystories.backend.domain.dto.comment.CommentCreateDto;
import com.citystories.backend.domain.dto.comment.CommentGetDto;
import com.citystories.backend.domain.entity.Comment;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper
public interface CommentMapper {
    CommentMapper INSTANCE = Mappers.getMapper(CommentMapper.class);

    @Mapping(target = "userId", source = "user.id")
    @Mapping(target = "pinId", source = "pin.id")
    CommentGetDto commentToCommentGetDto(Comment comment);

    @Mapping(target = "user.id", source = "userId")
    @Mapping(target = "pin.id", source = "pinId")
    Comment commentCreateDtoToComment(CommentCreateDto commentCreateDto);
}
