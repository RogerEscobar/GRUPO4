package com.amadeus.extraours.dto.response;

public class AuthenticationResponse {
    private String token;
    private String userRole;
    private String userName;

    public AuthenticationResponse(String token, String userRole, String userName){
        this.token = token;
        this.userRole = "ROLE_" + userRole;
        this.userName = userName;
    }

    //Getter


    public String getToken() {
        return token;
    }

    public String getUserRole() {
        return userRole;
    }

    public String getUserName() {
        return userName;
    }
}
