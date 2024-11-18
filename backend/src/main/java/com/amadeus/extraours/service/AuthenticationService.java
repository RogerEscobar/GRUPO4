package com.amadeus.extraours.service;


import com.amadeus.extraours.dto.response.AuthenticationResponse;
import com.amadeus.extraours.exception.InvalidVerificationCodeException;
import com.amadeus.extraours.exception.UserLockedException;
import com.amadeus.extraours.exception.UserNotFoundException;
import com.amadeus.extraours.model.User;
import com.amadeus.extraours.repository.UserRepository;
import com.amadeus.extraours.security.JwtService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.logging.Logger;

@Service
public class AuthenticationService {

    private static final Logger logger = Logger.getLogger(AuthenticationService.class.getName());
    private static final int CODE_EXPIRATION_MINUTES = 5;
    private static final int CODE_LENGTH = 6;


    private final UserRepository userRepository;
    private final EmailService emailService;
    private final JwtService jwtService;
    private final SecureRandom random;


    @Autowired
    public AuthenticationService(
            UserRepository userRepository,
            EmailService emailService,
            JwtService jwtService) {
        this.userRepository = userRepository;
        this.emailService = emailService;
        this.jwtService = jwtService;
        this.random = new SecureRandom();
    }


//    Enviar un código de verificación al email registrado
    @Transactional
    public void sendVerificationCode(String userId){
        logger.info("Iniciando proceso de envío de código de verificación para cédula: " + userId);

        //Obtener el usuario por cédula
        User user = userRepository.findById(Long.parseLong(userId))
                .orElseThrow(() -> new UserNotFoundException("Usuario no encontrado con cédula: " + userId));


        if (user.isLocked()) {
            logger.warning("Intento de acceso a cuenta bloqueada: " + userId);
            throw new UserLockedException("La cuenta está bloqueada. Contacte al administrador.");
        }

        String verificationCode = generateVerificationCode();
        LocalDateTime expiryTime = LocalDateTime.now().plusMinutes(CODE_EXPIRATION_MINUTES);

        user. setVerificationCode(verificationCode);
        user. setVerificationCodeExpiry(expiryTime);
        userRepository.save(user);

        emailService.sendVerificationCode(user.getEmail(), verificationCode);
        logger.info("Código de verificación enviado exitosamente al email asociado a: " + userId);
    }

//    Vaidar código suministrado

    @Transactional
    public AuthenticationResponse verifyCode(String userId, String code) {
        logger.info("Verificando código para usuario: " + userId);

        User user = userRepository.findById(Long.parseLong(userId))
                .orElseThrow(() -> new UserNotFoundException("Usuario no encontrado con cédula: " + userId));

        boolean isValid = code.equals(user.getVerificationCode()) &&
                LocalDateTime.now().isBefore(user.getVerificationCodeExpiry());

        if (!isValid) {
            handleInvalidCode(user);
            return null;
        }

        handleValidCode(user);
        logger.info("Código verificado exitosamente para: " + userId);

        //Convertir User a UserDetails para generar Token
        UserDetails userDetails = new org.springframework.security.core.userdetails.User(
                user.getId().toString(),
                "",
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()))
        );

        //Generar token y respuesta
        String token = jwtService.generateToken(userDetails);
        return new AuthenticationResponse(
                token,
                user.getRole().toString(),
                user.getName()
        );
    }

    private String generateVerificationCode(){
        StringBuilder code = new StringBuilder();
        for (int i = 0; i < CODE_LENGTH; i++){
            code.append(random.nextInt(10));
        }
        return code.toString();
    }

    private void handleInvalidCode(User user){
        user.incrementFailedAttempts();
        userRepository.save(user);

        if (user.isLocked()){
            logger.warning("Cuenta bloqueada después de múltiples intentos: " + user.getId());
        }

        throw new InvalidVerificationCodeException("Código de verificación invalido o expirado");
    }

    private void handleValidCode(User user){
        user.resetFailedAttempts();
        user.setVerificationCode(null);
        user.setVerificationCodeExpiry(null);
        userRepository.save(user);
    }
}
