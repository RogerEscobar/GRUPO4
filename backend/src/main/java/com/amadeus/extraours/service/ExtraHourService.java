package com.amadeus.extraours.service;


import com.amadeus.extraours.dto.response.ExtraHourValidationDTO;
import com.amadeus.extraours.exception.ExtraHourNotFoundException;
import com.amadeus.extraours.model.ExtraHour;
import com.amadeus.extraours.model.ExtraHourStatus;
import com.amadeus.extraours.model.ExtraHourType;
import com.amadeus.extraours.repository.ExtraHourRepository;
import jakarta.persistence.criteria.Predicate;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
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
    public ExtraHourService(ExtraHourRepository extraHourRepository, ExtraHourTypeCalculator typeCalculator) {
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

    // Obtener horas extra con filtros
    public Page<ExtraHour> getAllExtraHours(
            Long employeeId,
            ExtraHourStatus status,
            LocalDateTime startDate,
            LocalDateTime endDate,
            Pageable pageable) {

        logger.info("Buscando horas extra con filtros - employeeId: " + employeeId +
                ", status: " + status + ", startDate: " + startDate + ", endDate: " + endDate);

        // Si no hay filtro de status, usar el metodo existente
        if (status == null) {
            return extraHourRepository.findByFilters(employeeId, startDate, endDate, pageable);
        }

        // Crear especificacion con filtros
        Specification<ExtraHour> spec = (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (employeeId != null) {
                predicates.add(criteriaBuilder.equal(root.get("employeeId"), employeeId));
            }

            if (status != null) {
                predicates.add(criteriaBuilder.equal(root.get("status"), status));
            }

            if (startDate != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("startDateTime"), startDate));
            }

            if (endDate != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("endDateTime"), endDate));
            }

            return predicates.isEmpty() ? null : criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };

        return extraHourRepository.findAll(spec, pageable);
    }

    //Validar las horas extra sin guardar

    public ExtraHourValidationDTO previewExtraHour(ExtraHour extraHour) {
        ExtraHourValidationDTO validation = new ExtraHourValidationDTO();

        try {
            validateExtraHour(extraHour);

            Map<ExtraHourType, Double> hoursPerType = calculateHoursPerType (
                    extraHour.getStartDateTime(),
                    extraHour.getEndDateTime()
            );

            //Asignación de horas calculadas
            validation.setHorasDiurnas(hoursPerType.getOrDefault(ExtraHourType.EXTRA_DIURNA, 0.0));
            validation.setHorasNocturnas(hoursPerType.getOrDefault(ExtraHourType.EXTRA_NOCTURNA, 0.0));
            validation.setHorasDominicalesDiurnas(hoursPerType.getOrDefault(ExtraHourType.EXTRA_DOMINICAL_DIURNA, 0.0));
            validation.setHorasDominicalesNocturnas(hoursPerType.getOrDefault(ExtraHourType.EXTRA_DOMINICAL_NOCTURNA, 0.0));
            validation.setValid(true);
        } catch (IllegalArgumentException e) {
            validation.setValid(false);
            validation.setMessage(e.getMessage());
        }

        return validation;
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

        logger.info("Actualizando registro - ID: " + id +
                ", EmployeeId Original: " + existingExtraHour.getEmployeeId() +
                ", EmployeeId Solicitante: " + updatedExtraHour.getEmployeeId() +
                ", Status: " + existingExtraHour.getStatus());


        // Validar que solo se puedan modificar registros pendientes
        if (existingExtraHour.getStatus() != ExtraHourStatus.PENDIENTE) {
            logger.warning("Intento de modificar registro no pendiente");
            throw new IllegalStateException("Solo se pueden modificar registros en estado pendiente");
        }

        // Validar que el usuario solo pueda modificar sus propios registros
        if (!existingExtraHour.getEmployeeId().equals(updatedExtraHour.getEmployeeId())) {
            logger.warning("Intento de modificar registro de otro empleado");
            throw new IllegalStateException("No tienes permisos para modificar registros de otros empleados");
        }

        // Realizar validaciones básicas
        validateExtraHour(updatedExtraHour);

        try {
            // Actualizar los campos
            updateExtraHourFields(existingExtraHour, updatedExtraHour);

            // Recalcular el tipo de hora extra
            ExtraHourType calculatedType = typeCalculator.calculateType(existingExtraHour.getStartDateTime());
            existingExtraHour.setType(calculatedType);

            ExtraHour savedExtraHour = extraHourRepository.save(existingExtraHour);
            logger.info("Registro actualizado exitosamente - ID: " + id);
            return savedExtraHour;
        } catch (Exception e) {
            logger.severe("Error al actualizar registro - ID: " + id + " - Error: " + e.getMessage());
            throw new RuntimeException("Error al actualizar el registro", e);
        }
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

    // Obtiene el resumen de horas extra por empleado y período
    public Map<String, Object> getExtraHourSummary(Long employeeId, LocalDateTime startDate, LocalDateTime endDate) {
        Map<String, Object> summary = new HashMap<>();

        // Obtener todas las horas del período usando el método existente
        Page<ExtraHour> allHours = getAllExtraHours(
                employeeId,
                null,
                startDate,
                endDate,
                Pageable.unpaged()
        );

        // Inicializar contadores
        double totalHours = 0.0;
        double pendingHours = 0.0;
        double approvedHours = 0.0;
        long pendingCount = 0;
        long approvedCount = 0;

        // Calcular totales iterando sobre los registros
        for (ExtraHour hour : allHours.getContent()) {
            double hours = hour.getHours();
            totalHours += hours;

            if (hour.getStatus() == ExtraHourStatus.PENDIENTE) {
                pendingHours += hours;
                pendingCount++;
            } else if (hour.getStatus() == ExtraHourStatus.APROBADO) {
                approvedHours += hours;
                approvedCount++;
            }
        }

        // Construir objeto de respuesta
        summary.put("totalHours", totalHours);
        summary.put("pendingHours", pendingHours);
        summary.put("approvedHours", approvedHours);
        summary.put("pendingCount", pendingCount);
        summary.put("approvedCount", approvedCount);
        summary.put("employeeId", employeeId);
        summary.put("startDate", startDate);
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

//Validaciones basicas de hora extra
    public void validateExtraHour(ExtraHour extraHour) {
        if (extraHour.getStartDateTime().isAfter(extraHour.getEndDateTime())){
            throw new IllegalArgumentException("La fecha de inicio debe ser anterior a la fecha del fin");
        }

        if (extraHour.getStartDateTime().isAfter(LocalDateTime.now())){
            throw new IllegalArgumentException("No se pueden registrar horas extra futuras");
        }
    }



//Actualiza los campos de una hora extra
    private void updateExtraHourFields(ExtraHour existing, ExtraHour updated) {
        existing.setStartDateTime(updated.getStartDateTime());
        existing.setEndDateTime(updated.getEndDateTime());
        existing.setType(updated.getType());
        existing.setObservations(updated.getObservations());
    }

    //calculo de horas por tipo para un rango de tiempo
    private Map<ExtraHourType, Double> calculateHoursPerType (
            LocalDateTime startDateTime,
            LocalDateTime endDateTime ) {

        Map<ExtraHourType, Double> hoursPerType = new HashMap<>();
        LocalDateTime currentTime = startDateTime;

        while (currentTime.isBefore(endDateTime)) {
            ExtraHourType type = typeCalculator.calculateType(currentTime);

            //Calcular minutos hasta el siguiente cambio de tipo
            LocalDateTime nextChange = getNextTypeChange(currentTime, endDateTime);
            double hours = Duration.between(currentTime, nextChange).toMinutes() / 60.0;

            //Acumular las horas por tipo
            hoursPerType.merge(type, hours, Double::sum);

            currentTime = nextChange;
        }

        return hoursPerType;

    }

    //Calcula el siguiente momento donde cambia el tipo de hora

    private LocalDateTime getNextTypeChange(LocalDateTime current, LocalDateTime end) {
        LocalDateTime nextChange;
        int currentHour = current.getHour();
        int currentMinute = current.getMinute();

        if (currentHour < 6) {
            nextChange = current.withHour(6).withMinute(0);
        } else if (currentHour < 21 || (currentHour == 21 && currentMinute == 0)) {
            nextChange = current.withHour(21).withMinute(0);
        } else {
            nextChange = current.plusDays(1).withHour(6).withMinute(0);
        }

        return nextChange.isAfter(end) ? end : nextChange;

    }
}
