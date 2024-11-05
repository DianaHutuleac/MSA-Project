package com.citystories.demo.controller;

import com.citystories.demo.domain.dto.user.UserCreateDto;
import com.citystories.demo.domain.dto.user.UserGetDto;
import com.citystories.demo.service.UserDataService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/users")
public class UserController {
    private final UserDataService userDataService;

    public UserController(UserDataService userDataService) {
        this.userDataService = userDataService;
    }

    @PostMapping
    public ResponseEntity<UserGetDto> createUser(@RequestBody UserCreateDto userCreateDto) {
        UserGetDto userDto = userDataService.createUser(userCreateDto);
        return new ResponseEntity<>(userDto, HttpStatus.CREATED);
    }
}
