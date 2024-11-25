package com.amadeus.extraours.dto.response;

public class ExtraHourValidationDTO {
    private double horasDiurnas;
    private double horasNocturnas;
    private double horasDominicalesDiurnas;
    private double horasDominicalesNocturnas;
    private boolean isValid;
    private String message;

    //Constructor
    public ExtraHourValidationDTO() {}

    //Getters y Setters


    public double getHorasDiurnas() {
        return horasDiurnas;
    }

    public void setHorasDiurnas(double horasDiurnas) {
        this.horasDiurnas = horasDiurnas;
    }

    public double getHorasNocturnas() {
        return horasNocturnas;
    }

    public void setHorasNocturnas(double horasNocturnas) {
        this.horasNocturnas = horasNocturnas;
    }

    public double getHorasDominicalesDiurnas() {
        return horasDominicalesDiurnas;
    }

    public void setHorasDominicalesDiurnas(double horasDominicalesDiurnas) {
        this.horasDominicalesDiurnas = horasDominicalesDiurnas;
    }

    public double getHorasDominicalesNocturnas() {
        return horasDominicalesNocturnas;
    }

    public void setHorasDominicalesNocturnas(double horasDominicalesNocturnas) {
        this.horasDominicalesNocturnas = horasDominicalesNocturnas;
    }

    public boolean isValid() {
        return isValid;
    }

    public void setValid(boolean valid) {
        isValid = valid;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }




}
