package com.amadeus.extraours.service;


import com.amadeus.extraours.exception.ExtraHourNotFoundException;
import com.amadeus.extraours.model.ExtraHour;
import com.amadeus.extraours.model.ExtraHourStatus;
import com.amadeus.extraours.model.ExtraHourType;
import com.amadeus.extraours.repository.ExtraHourRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;

@Service
public class ExtraHourService {
    //Traking de operaciones
    private static final Logger logger = Logger.getLogger(ExtraHourService.class.getName());

    //Dependencias
    private final ExtraHourRepository extraHourRepository;
    private final ExtraHourTypeCalculator typeCalculator;

    @Autowired
    public ExtraHourService(
            ExtraHourRepository extraHourRepository,
            ExtraHourTypeCalculator typeCalculator) {
        this.extraHourRepository = extraHourRepository;
        this.typeCalculator = typeCalculator;
    }

    //Registro de horas extras
    public ExtraHour registerExtraHour(ExtraHour extraHour) {
        logger.info("Iniciando registro de hora extra para empleado: " + extraHour.getEmployeeId());
        validateExtraHour(extraHour);

        //Validar solapamiento
        if (extraHourRepository.existsOverlappingHours(
                extraHour.getEmployeeId(),
                extraHour.getStartDateTime(),
                extraHour.getEndDateTime())) {
            throw new IllegalStateException("Ya existe un registro de horas extra para este periodo");
        }

        //Calcular el tipo de hora
        ExtraHourType calculatedType = typeCalculator.calculateType(extraHour.getStartDateTime());
        extraHour.setType(calculatedType);
        extraHour.setStatus(ExtraHourStatus.PENDIENTE);

        ExtraHour savedExtraHour = extraHourRepository.save(extraHour);
        logger.info("Hora extra registrada para empleado: " +extraHour.getEmployeeId()+
                " con tipo: " + calculatedType);
        return savedExtraHour;
    }

//    Obtener todas las horas extra paginadas

    public Page<ExtraHour> getAllExtraHours(
            Long employeedId,
            ExtraHourStatus status,
            LocalDateTime startDate,
            LocalDateTime endDate,
            Pageable pageable) {

        return extraHourRepository.findByFilters(employeedId, startDate, endDate, pageable);
    }

//    Obtener una hora extra por ID

    public ExtraHour getExtraHourByID(Long id) {
        return extraHourRepository.findById(id)
                .orElseThrow(() -> new ExtraHourNotFoundException("Hora extra no encontrada con ID: " + id));
    }

//Actualizar el estado de una hora extra existente
    @Transactional
    public ExtraHour updateExtraHour(Long id, ExtraHour updatedExtraHour) {
        ExtraHour existingExtraHour = getExtraHourByID(id);

        if (existingExtraHour.getStatus() == ExtraHourStatus.APROBADO) {
            throw new IllegalStateException("No se puede modificar una hora extra aprobada");
        }

        updateExtraHourFields(existingExtraHour, updatedExtraHour);
        return extraHourRepository.save(existingExtraHour);
    }

//    Actualiza el estado de un registro
    @Transactional
    public ExtraHour updateStatus(Long id, ExtraHourStatus newStatus) {
        ExtraHour extraHour = getExtraHourByID(id);
        extraHour.setStatus(newStatus);
        logger.info("Estado actualizado para hora extra ID: " + id + " - Nuevo estado: " + newStatus);
        return extraHourRepository.save(extraHour);
    }

//    Obtener horas por empleado
    public List<ExtraHour> getExtraHoursByEmployeeId(Long employeeId) {
        return extraHourRepository.findByEmployeeId(employeeId);
    }

//    Obtiene las horas extra totales de un empleado x periodo
    public Double getTotalHoursByEmployee(Long employeeId, LocalDateTime start, LocalDateTime end){
        return extraHourRepository.getTotalHoursByEmployeeAndPeriod(employeeId, start, end);
    }

    public Map<String, Object> getExtraHourSummary(
            Long employeeId,
            LocalDateTime startDate,
            LocalDateTime endDate) {

        Map<String, Object> summary = new HashMap<>();
        Double totalHours = getTotalHoursByEmployee(employeeId, startDate, endDate);

        summary.put("totalHours", totalHours !=null ? totalHours : 0.0);
        summary.put("employeeId", employeeId);
        summary.put("starDate", startDate);
        summary.put("endDate", endDate);

        return summary;
    }

    //Eliminar una hora extra
    public void deleteExtraHour(Long id){
        if (!extraHourRepository.existsById(id)){
            throw new ExtraHourNotFoundException("No se puede eliminar. Hora extra no encontrada con ID " +id);
        }
        extraHourRepository.deleteById(id);
    }


    private void validateExtraHour(ExtraHour extraHour) {
        if (extraHour.getStartDateTime().isAfter(extraHour.getEndDateTime())){
            throw new IllegalArgumentException("La fecha de inicio debe ser anterior a la fecha del fin");
        }

        if (extraHour.getStartDateTime().isAfter(LocalDateTime.now())){
            throw new IllegalArgumentException("No se pueden registrar horas extra futuras");
        }
    }




    private void updateExtraHourFields(ExtraHour existing, ExtraHour updated) {
        existing.setStartDateTime(updated.getStartDateTime());
        existing.setEndDateTime(updated.getEndDateTime());
        existing.setType(updated.getType());
        existing.setObservations(updated.getObservations());
    }
}
