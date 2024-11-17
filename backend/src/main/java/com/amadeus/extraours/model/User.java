package com.amadeus.extraours.model;


import jakarta.persistence.*;
import jakarta.validation.constraints.*;

import java.time.LocalDateTime;

@Entity
@Table (name = "users")
public class User {

    @Id
    private Long id;

    @NotBlank(message = "El nombre no puede estar vacío")
    @Size(min = 2, max = 100)
    @Column(nullable = false)
    private String name;

    @NotBlank(message = "El email no puede estar vacío")
    @Email(message = "El mail debe ser valido")
    @Column(nullable = false, unique = true)
    private String email;

    @Enumerated (EnumType.STRING)
    @Column(nullable = false)
    private UserRole role;

    @Column(length = 6)
    private String verificationCode;

    private LocalDateTime verificationCodeExpiry;

    @Column(name = "failed_attempts")
    private int failedAttempts = 0;

    //Estados del usuario

    @Column(nullable = false)
    private boolean active = true;

    @Column(nullable = false)
    private boolean locked = false;

    //Contructor vacio para JPA
    public User() {}

    //Constructor para crear usuarios
    public User(Long id, String name, String email, UserRole role){
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
    }

    // Métodos de utilidad
    public void incrementFailedAttempts() {
        this.failedAttempts++;
        if (this.failedAttempts >= 3) {
            this.locked = true;
        }
    }

    public void resetFailedAttempts() {
        this.failedAttempts = 0;
        this.locked = false;
    }

    public boolean isVerificationCodeValid(){
        return verificationCode != null &&
                verificationCodeExpiry != null &&
                LocalDateTime.now().isBefore(verificationCodeExpiry);
    }

    public String getAuthority(){
        return "ROLE_" + this.role.name();
    }

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public UserRole getRole() {
        return role;
    }

    public void setRole(UserRole role) {
        this.role = role;
    }

    public String getVerificationCode() {
        return verificationCode;
    }

    public void setVerificationCode(String verificationCode) {
        this.verificationCode = verificationCode;
    }

    public LocalDateTime getVerificationCodeExpiry() {
        return verificationCodeExpiry;
    }

    public void setVerificationCodeExpiry(LocalDateTime verificationCodeExpiry) {
        this.verificationCodeExpiry = verificationCodeExpiry;
    }

    public int getFailedAttempts() {
        return failedAttempts;
    }

    public void setFailedAttempts(int failedAttempts) {
        this.failedAttempts = failedAttempts;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public boolean isLocked() {
        return locked;
    }

    public void setLocked(boolean locked) {
        this.locked = locked;
    }




}
