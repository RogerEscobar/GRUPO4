package com.amadeus.extraours.dto.request;

import jakarta.validation.constraints.NotBlank;

public class AuthenticationRequest {
    @NotBlank(message = "La cédula es requerida")
    private String userId;

    @NotBlank(message = "El código de verificación es requerido")
    private String verificationCode;

    //Geters y setters


    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getVerificationCode() {
        return verificationCode;
    }

    public void setVerificationCode(String verificationCode) {
        this.verificationCode = verificationCode;
    }
}
