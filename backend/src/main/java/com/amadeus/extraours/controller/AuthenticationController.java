package com.amadeus.extraours.controller;

import com.amadeus.extraours.dto.request.AuthenticationRequest;
import com.amadeus.extraours.dto.response.AuthenticationResponse;
import com.amadeus.extraours.service.AuthenticationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthenticationController {

    private final AuthenticationService authenticationService;

    @Autowired
    public AuthenticationController(AuthenticationService authenticationService) {
        this.authenticationService = authenticationService;
    }

    @PostMapping("/send-code")
    public ResponseEntity<Map<String, String>> sendVerificationCode(@RequestParam String email){
        authenticationService.sendVerificationCode(email);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Código de verificación envíado");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/verify")
    public ResponseEntity<AuthenticationResponse> verifyCode(
            @Valid @RequestBody AuthenticationRequest request) {
        AuthenticationResponse response = authenticationService.verifyCode(
                request.getUserId(),
                request.getVerificationCode()
        );
        return ResponseEntity.ok(response);
    }
}