package com.citystories.backend.controller;


import com.citystories.backend.domain.dto.user.UserCreateDto;
import com.citystories.backend.domain.dto.user.UserGetDto;
import com.citystories.backend.domain.dto.user.UserLogInDto;
import com.citystories.backend.service.UserDataService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/user")
public class UserController {
    private final UserDataService userDataService;

    public UserController(UserDataService userDataService) {
        this.userDataService = userDataService;
    }

    @PostMapping("/register")
    public ResponseEntity<UserGetDto> registerUser(@RequestBody UserCreateDto userCreateDto) {
        return new ResponseEntity<>(userDataService.registerUser(userCreateDto), HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<UserGetDto> loginUser(@RequestBody UserLogInDto userLogInDto) {
        return new ResponseEntity<>(userDataService.loginUser(userLogInDto), HttpStatus.OK);
    }
}
