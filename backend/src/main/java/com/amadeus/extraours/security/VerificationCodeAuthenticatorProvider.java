package com.amadeus.extraours.security;


import com.amadeus.extraours.exception.InvalidVerificationCodeException;
import com.amadeus.extraours.model.User;
import com.amadeus.extraours.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Collections;

@Component
public class VerificationCodeAuthenticatorProvider implements AuthenticationProvider {

    @Autowired
    private UserRepository userRepository;

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException{
        String email = authentication.getName();
        String verificationCode = authentication.getCredentials().toString();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new InvalidVerificationCodeException("Usuario no encontrado"));

        if (user.isLocked()) {
            throw new InvalidVerificationCodeException("Usuario bloqueado");
        }

        if (!isValidVerificationCode(user, verificationCode)){
            handleFailedAttempt(user);
            throw new InvalidVerificationCodeException("Código de verificación inválido o expirado");
        }

        //Resetear el código y los intentos fallidos

        resetVerificationCode(user);

        return new UsernamePasswordAuthenticationToken(
                email,
                null,
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()))
        );
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return authentication.equals(UsernamePasswordAuthenticationToken.class);
    }

    private boolean isValidVerificationCode(User user, String verificationCode) {
        return user.getVerificationCode() != null &&
                user.getVerificationCode().equals(verificationCode) &&
                user.getVerificationCodeExpiry() != null &&
                LocalDateTime.now().isBefore(user.getVerificationCodeExpiry());
    }

    private void handleFailedAttempt(User user){
        user.incrementFailedAttempts();
        userRepository.save(user);
    }

    private void resetVerificationCode(User user){
        user.setVerificationCode(null);
        user.setVerificationCodeExpiry(null);
        user.resetFailedAttempts();
        userRepository.save(user);
    }
}
