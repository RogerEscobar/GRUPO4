package com.amadeus.extraours.exception;

public class InvalidVerificationCodeException extends RuntimeException{
    public InvalidVerificationCodeException (String message){
        super(message);
    }
}
