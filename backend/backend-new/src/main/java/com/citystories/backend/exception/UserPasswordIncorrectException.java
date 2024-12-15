package com.citystories.backend.exception;

public class UserPasswordIncorrectException extends RuntimeException {
    public UserPasswordIncorrectException(String message) {
        super(message);
    }
}
