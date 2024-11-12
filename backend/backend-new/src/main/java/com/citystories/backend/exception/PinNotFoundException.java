package com.citystories.backend.exception;

public class PinNotFoundException extends RuntimeException {
    public PinNotFoundException(String message) {
        super(message);
    }
}
