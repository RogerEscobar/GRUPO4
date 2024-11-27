package com.amadeus.extraours.dto.response;

import com.amadeus.extraours.model.ExtraHour;
import com.amadeus.extraours.model.ExtraHourStatus;
import com.amadeus.extraours.model.ExtraHourType;

import java.time.LocalDateTime;

public class ExtraHourDTO {
    private Long id;
    private Long employeeId;
    private LocalDateTime startDateTime;
    private LocalDateTime endDateTime;
    private double hours;
    private ExtraHourType type;
    private ExtraHourStatus status;
    private String observations;


    //Constructor
    public ExtraHourDTO() {

    }

    //Getters y setters


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(Long employeeId) {
        this.employeeId = employeeId;
    }

    public LocalDateTime getStartDateTime() {
        return startDateTime;
    }

    public void setStartDateTime(LocalDateTime startDateTime) {
        this.startDateTime = startDateTime;
    }

    public LocalDateTime getEndDateTime() {
        return endDateTime;
    }

    public void setEndDateTime(LocalDateTime endDateTime) {
        this.endDateTime = endDateTime;
    }

    public double getHours() {
        return hours;
    }

    public void setHours(double hours) {
        this.hours = hours;
    }

    public ExtraHourType getType() {
        return type;
    }

    public void setType(ExtraHourType type) {
        this.type = type;
    }

    public ExtraHourStatus getStatus() {
        return status;
    }

    public void setStatus(ExtraHourStatus status) {
        this.status = status;
    }

    public String getObservations() {
        return observations;
    }

    public void setObservations(String observations) {
        this.observations = observations;
    }

    //metodo para convertir entity en DTO
    public static ExtraHourDTO fromEntity(ExtraHour entity) {
        ExtraHourDTO dto = new ExtraHourDTO();
        dto.setId(entity.getId());
        dto.setEmployeeId(entity.getEmployeeId());
        dto.setStartDateTime(entity.getStartDateTime());
        dto.setEndDateTime(entity.getEndDateTime());
        dto.setHours(entity.getHours());
        dto.setType(entity.getType());
        dto.setStatus(entity.getStatus());
        dto.setObservations(entity.getObservations());
        return dto;
    }
}
