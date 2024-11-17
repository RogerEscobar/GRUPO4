package com.amadeus.extraours.config;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;

import java.util.Properties;
import java.util.logging.Logger;

@Configuration
public class MailConfig {

    private static final Logger logger = Logger.getLogger(MailConfig.class.getName());

//    Configuración para el servidor de correo

    @Value("${spring.mail.host}")
    private String mailHost;

    @Value("${spring.mail.port}")
    private int mailPort;

    @Value("${spring.mail.username}")
    private String mailUsername;

    @Value("${spring.mail.password}")
    private String mailPassword;

//    Valores por defecto para las propiedades de correo
    private static final String TRANSPORT_PROTOCOL = "smtp";
    private static final String SMTP_AUTH = "true";
    private static final String SMTP_STARTTLS ="true";
    private static final String MAIL_DEBUG = "true";

//    Configuracion JavaMail

    @Bean
    public JavaMailSender getJavaMailSender() {
        JavaMailSenderImpl mailSender = new JavaMailSenderImpl();

        mailSender.setHost(mailHost);
        mailSender.setPort(mailPort);
        mailSender.setUsername(mailUsername);
        mailSender.setPassword(mailPassword);

        mailSender.setJavaMailProperties(getMailPropeties());

        logger.info("Configuración de correo inicializada con host: " + mailHost + " y puerto: " + mailPort);

        return mailSender;

    }

//    Configuracion propiedades adicionales para el serv de correo

    private Properties getMailPropeties() {
        Properties props = new Properties();

        props.put("mail.transport.protocol", TRANSPORT_PROTOCOL);
        props.put("mail.smtp.auth", SMTP_AUTH);
        props.put("mail.smtp.starttls.enable", SMTP_STARTTLS);
        props.put("mail.debug",MAIL_DEBUG);

        props.put("mail.smtp.ssl.trust",mailHost);
        props.put("mail.smtp.connectiontimeout", "5000");
        props.put("mail.smtp.timeout", "5000");
        props.put("mail.smtp.writetimeout", "5000");

        return props;
    }
}
