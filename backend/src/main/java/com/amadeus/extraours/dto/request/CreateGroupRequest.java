package com.amadeus.extraours.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class CreateGroupRequest {

    @NotBlank(message = "El nombre del grupo no puede estar vacio")
    private String name;

    @NotNull(message = "El ID del líder no puede ser nulo")
    private Long leaderId;

    // Getters y Setters

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getLeaderId() {
        return leaderId;
    }

    public void setLeaderId(Long leaderId) {
        this.leaderId = leaderId;
    }
}
