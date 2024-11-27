package com.amadeus.extraours.dto.request;

import com.amadeus.extraours.model.ExtraHour;
import com.amadeus.extraours.model.ExtraHourType;
import jakarta.validation.constraints.*;

import java.time.LocalDateTime;

public class ExtraHourRequest {

    @NotNull(message = "El ID del empleado no puede ser nulo")
    private Long employeeId;

    @NotNull(message = "La fecha de inicio no puede ser nula")
    @PastOrPresent(message = "La fecha de inicio no puede ser futura")
    private LocalDateTime startDateTime;

    @NotNull(message = "La fecha de fin no puede ser nula")
    @PastOrPresent(message = "La fecha de fin no puede ser futura")
    private LocalDateTime endDateTime;

//    @NotNull(message = "El tipo de hora extra no puede ser nulo")
    private ExtraHourType type;

    @Size(max = 500, message = "Las observaciones no pueden exceder 500 caracteres")
    private String observations;

    //Getters

    public Long getEmployeeId() {
        return employeeId;
    }

    public LocalDateTime getStartDateTime() {
        return startDateTime;
    }

    public LocalDateTime getEndDateTime() {
        return endDateTime;
    }

    public ExtraHourType getType() {
        return type;
    }

    public String getObservations() {
        return observations;
    }

    // Setters


    public void setEmployeeId(Long employeeId) {
        this.employeeId = employeeId;
    }

    public void setStartDateTime(LocalDateTime startDateTime) {
        this.startDateTime = startDateTime;
    }

    public void setEndDateTime(LocalDateTime endDateTime) {
        this.endDateTime = endDateTime;
    }

    public void setType(ExtraHourType type) {
        this.type = type;
    }

    public void setObservations(String observations) {
        this.observations = observations;
    }

    //Convertir a entidad

    public ExtraHour toEntity() {
        ExtraHour extraHour = new ExtraHour();
        extraHour.setEmployeeId(this.employeeId);
        extraHour.setStartDateTime(this.startDateTime);
        extraHour.setEndDateTime(this.endDateTime);
        extraHour.setType(this.type);
        extraHour.setObservations(this.observations);
        return extraHour;
    }
}
