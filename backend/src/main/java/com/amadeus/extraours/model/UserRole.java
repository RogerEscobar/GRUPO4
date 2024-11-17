package com.amadeus.extraours.model;

public enum UserRole {
    EMPLEADO("Empleado"),
    TEAM_LEADER("Líder de Equipo"),
    MASTER("Administrador");

    private final String displayName;

    UserRole(String displayName){
        this.displayName = displayName;
    }

    public String getDisplayName(){
        return displayName;
    }
}
