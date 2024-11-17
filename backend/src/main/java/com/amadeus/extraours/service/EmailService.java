package com.amadeus.extraours.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.logging.Logger;

@Service
public class EmailService {

    private static final Logger logger = Logger.getLogger(EmailService.class.getName());
    private static final String FROM_EMAIL = "noreply@extrahours.com";
    private final JavaMailSender emailSender;

    @Autowired
    public EmailService(JavaMailSender emailSender) {
        this.emailSender = emailSender;
    }

//    Enviar el código de verificación por correo
    public void sendVerificationCode(String to, String verificationCode){
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(FROM_EMAIL);
            message.setTo(to);
            message.setSubject("Código de Verificación - Sistema de Horas Extra");
            message.setText(createVericacionMessage(verificationCode));

            emailSender.send(message);
            logger.info("Código de verificación enviado a: " + to);
        } catch (Exception e) {
            logger.severe("Error al enviar email a " + to + ": " + e.getMessage());
            throw new RuntimeException("Error al enviar código de verificación", e);
        }
    }

    private String createVericacionMessage(String code) {
        return String.format(
                "Bienvenido al Sistema de Horas Extra\n\n" +
                        "Su código de verificación es: %s\n\n" +
                        "Este código expirará en 5 minutos.\n\n" +
                        "Si usted no solicitó este código, por favor ignore este mensaje.\n\n" +
                        "Saludos,\nEquipo de Horas Extra",
                code
        );
    }
}
