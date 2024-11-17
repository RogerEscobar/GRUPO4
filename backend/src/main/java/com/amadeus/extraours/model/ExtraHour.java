package com.amadeus.extraours.model;


import jakarta.persistence.*;
import jakarta.validation.constraints.*;

import java.time.LocalDateTime;

@Entity
@Table(name= "extra_hours")
public class ExtraHour {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "La fecha inicio no puede ser nula")
    @PastOrPresent(message = "La fecha y hora de inicio no puede ser en el futuro")
    @Column(nullable = false, name = "start_date_time")
    private LocalDateTime startDateTime; //Fecha de la hora extra

    @NotNull(message = "La fecha fin no puede ser nula")
    @PastOrPresent(message = "La fecha y hora fin no pueder en el futuro")
    @Column(nullable = false, name = "end_date_time")
    private LocalDateTime endDateTime;

    @NotNull(message = "El ID del empleado no puede ser nulo")
    @Column(nullable = false, name = "employee_id")
    private Long employeeId; //Cédula del empleado

    @Positive(message = "Las horas deben ser un número positivo")
    @DecimalMax(value = "24.0", message = "Las horas no pueden exceder 24 por registro")
    @Column(nullable = false)
    private double hours; //Cantidad de horas extra

    @NotNull(message = "El tipo de hora no puede ser nulo")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ExtraHourType type;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ExtraHourStatus status = ExtraHourStatus.PENDIENTE;

    @Size(max = 500, message = "La observación no puede exceder 500 caracteres")
    @Column(length = 500)
    private String observations;



    //Constructor vacio JPA
    public ExtraHour(){}

    //Constructor
    protected ExtraHour (Long employeeId, LocalDateTime startDateTime, LocalDateTime endDateTime, ExtraHourType type) {
        this.employeeId = employeeId;
        this.startDateTime = startDateTime;
        this.endDateTime = endDateTime;
        this.type = type;
        calculateHours();
    }

    //Getters

    public Long getId(){
        return id;
    }

    public Long getEmployeeId(){
        return employeeId;
    }

    public LocalDateTime getStartDateTime(){
        return startDateTime;
    }

    public LocalDateTime getEndDateTime(){
        return endDateTime;
    }

    public double getHours(){
        return hours;
    }

    public ExtraHourType getType(){
        return type;
    }

    public ExtraHourStatus getStatus(){
        return status;
    }

    public String getObservations(){
        return observations;
    }


    //Setters

    public void setId(Long id){
        this.id = id;
    }

    public void setEmployeeId(Long employeeId) {
        this.employeeId = employeeId;
    }

    public void setStartDateTime(LocalDateTime startDateTime) {
        this.startDateTime = startDateTime;
        calculateHoursIfPossible();
    }

    public void setEndDateTime(LocalDateTime endDateTime) {
        this.endDateTime = endDateTime;
        calculateHoursIfPossible();
    }

    public void setType(ExtraHourType type) {
        this.type = type;
    }

    public void setStatus(ExtraHourStatus status) {
        this.status = status;
    }

    public void setObservations(String observations) {
        this.observations = observations;
    }


    //Metodo para calcular horas
    private void calculateHours(){
        if (startDateTime != null && endDateTime != null){
            long minutes = java.time.Duration.between(startDateTime, endDateTime).toMinutes();
            this.hours = Math.round(minutes / 60.0 * 100.0) / 100.0;
        }
    }

    private void calculateHoursIfPossible(){
        if (startDateTime != null && endDateTime != null){
            calculateHours();
        }
    }

    @PrePersist
    @PreUpdate
    protected void onSave(){
        if (status == null) {
            status = ExtraHourStatus.PENDIENTE;
        }
        calculateHoursIfPossible();
    }

    //Validaciones
    @AssertTrue(message = "La fecha de fin debe ser posterior a la fecha de inicio")
    private boolean isEndDateTimeAfterStartDateTime() {
        if (startDateTime == null || endDateTime == null) {
            return true;
        }
        return  endDateTime.isAfter(startDateTime);
    }

    @AssertTrue(message = "El registro excede el límite de 2 horas diarias")
    private boolean isWithinDailyLimit() {
        return hours <= 2.0;
        }

    }






