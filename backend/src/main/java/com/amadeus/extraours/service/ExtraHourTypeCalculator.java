package com.amadeus.extraours.service;


import com.amadeus.extraours.model.ExtraHourType;
import de.jollyday.HolidayCalendar;
import de.jollyday.HolidayManager;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.logging.Logger;

@Service
public class ExtraHourTypeCalculator {
    private static final Logger logger = Logger.getLogger(ExtraHourTypeCalculator.class.getName());

    // Horarios según normativa colombiana
    private static final LocalTime DIURNO_START = LocalTime.of(6, 0);
    private static final LocalTime DIURNO_END = LocalTime.of(21, 0);

    //Festivos para colombia
    private final HolidayManager holidayManager;

    public ExtraHourTypeCalculator(){
        //Calendario especifico de colombia
        this.holidayManager = HolidayManager.getInstance(HolidayCalendar.COLOMBIA);
    }

    // Calcular el tipo de hora extra

    public ExtraHourType calculateType(LocalDateTime dateTime) {
        logger.info("Calculando tipo de hora extra para: " + dateTime);

        boolean isDomingoOFestivo = isDomingoOFestivo(dateTime);
        boolean isHorarioNocturno = isNightTime(dateTime.toLocalTime());

        // Determinar tipo de hora extra según tabla de recargos

        if (isDomingoOFestivo) {
            if (isHorarioNocturno) {
                logger.info("calculado como EXTRA_DOMINICAL_NOCTURA");
                return ExtraHourType.EXTRA_DOMINICAL_NOCTURNA;
            } else {
                logger.info("Calculado como EXTRA_DOMINCAL_DIURNA");
                return ExtraHourType.EXTRA_DOMINICAL_DIURNA;
            }
        } else {
            if (isHorarioNocturno) {
                logger.info("Calculado como EXTRA_NOCTURNA");
                return ExtraHourType.EXTRA_NOCTURNA;
            } else {
                logger.info("Calculado como EXTRA_DIURNA");
                return ExtraHourType.EXTRA_DIURNA;
            }
        }
    }

    // Verifica si la hora esta en horario nocturno

    private boolean isNightTime(LocalTime time) {
        return time.isBefore(DIURNO_START) || time.isAfter(DIURNO_END);
    }

    //vALIDA SI DOMINGO O FESTIVO

    private boolean isDomingoOFestivo(LocalDateTime dateTime) {
        boolean isDomingo = dateTime.getDayOfWeek() == DayOfWeek.SUNDAY;
        boolean isFestivo = holidayManager.isHoliday(dateTime.toLocalDate());

        logger.info(String.format("Verificando fecha %s: Domingo=%s, Festivo=%s",
                dateTime.toLocalDate(), isDomingo, isFestivo));

        return isDomingo || isFestivo;
    }

}
