package com.amadeus.extraours.controller;

import com.amadeus.extraours.dto.request.ExtraHourRequest;
import com.amadeus.extraours.dto.response.ExtraHourDTO;
import com.amadeus.extraours.dto.response.ExtraHourValidationDTO;
import com.amadeus.extraours.model.ExtraHour;
import com.amadeus.extraours.model.ExtraHourStatus;
import com.amadeus.extraours.service.ExtraHourService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.logging.Logger;

@RestController
@RequestMapping("/api/extrahours") // URL de solicitudes
@Validated
@Tag(name= "Horas Extra", description = "API para la gestión de horas extra")
@CrossOrigin(origins = "http://localhost:5173")
public class ExtraHourController {

    private static final Logger logger = Logger.getLogger(ExtraHourController.class.getName());

    private final ExtraHourService extraHourService;

    @Autowired
    public ExtraHourController(ExtraHourService extraHourService){

        this.extraHourService = extraHourService;
    }

    @Operation(summary = "Validar hora extra antes de registrar")
    @PostMapping("/preview")
    @PreAuthorize("hasRole('EMPLEADO')")
    public ResponseEntity<ExtraHourValidationDTO> previewExtraHour(@Valid @RequestBody ExtraHourRequest request) {
        ExtraHourValidationDTO validation = extraHourService.previewExtraHour(request.toEntity());
        return ResponseEntity.ok(validation);
    }


    @Operation(summary = "Registrar nueva hora extra")
    @PostMapping
    @PreAuthorize("hasRole('EMPLEADO')")
    public ResponseEntity<ExtraHourDTO> registerExtraHour(@Valid @RequestBody ExtraHourRequest request){
        logger.info("Registrando nueva hora extra para empleado: " + request.getEmployeeId());
        ExtraHour extraHour = extraHourService.registerExtraHour(request.toEntity());
        return new ResponseEntity<>(ExtraHourDTO.fromEntity(extraHour), HttpStatus.CREATED);
    }

    @Operation(summary = "Obtener todas las horas extra")
    @GetMapping
    @PreAuthorize("hasAnyRole('EMPLEADO', 'TEAM_LEADER', 'MASTER')")
    public ResponseEntity<Page<ExtraHourDTO>> getAllExtraHours(
            @RequestParam(required = false) Long employeeId,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)LocalDateTime endDate,
            Pageable pageable) {

        ExtraHourStatus statusEnum = null;
        if (status != null && !status.isEmpty()) {
            try {
                statusEnum = ExtraHourStatus.valueOf(status.toUpperCase());
            } catch (IllegalArgumentException e) {
                logger.warning("Estado invalido: " + status);
            }
        }

//        Log para depuración
        logger.info("Consultando horas extra con filtros - " +
                "employeeId: " + employeeId +
                ", status: " + statusEnum +
                ", startDate: " + startDate +
                ", endDate: " + endDate);

        Page<ExtraHour> extraHours = extraHourService.getAllExtraHours(employeeId, statusEnum, startDate, endDate, pageable);
        return ResponseEntity.ok(extraHours.map(ExtraHourDTO::fromEntity));
    }

    @Operation(summary = "Obtener hora extra por ID")
    @GetMapping("/{id}")
    public ResponseEntity<ExtraHourDTO> getExtraHourById(@PathVariable Long id) {
        ExtraHour extraHour = extraHourService.getExtraHourByID(id);
        return ResponseEntity.ok(ExtraHourDTO.fromEntity(extraHour));
    }

    @Operation(summary = "Actualizar hora extra")
    @PutMapping("/{id}")
    @PreAuthorize("hasRole( 'EMPLEADO')")
    public ResponseEntity<ExtraHourDTO> updateExtraHour(
            @PathVariable Long id,
            @Valid @RequestBody ExtraHourRequest request) {

        logger.info("Solicitud de actualización recibida - ID: " + id +
                ", Request: { employeeId: " + request.getEmployeeId() +
                ", startDateTime: " + request.getStartDateTime() +
                ", endDateTime: " + request.getEndDateTime() +
                ", observations: " + request.getObservations() + " }");



        ExtraHour updatedExtraHour = extraHourService.updateExtraHour(id, request.toEntity());
        return ResponseEntity.ok(ExtraHourDTO.fromEntity(updatedExtraHour));
    }

    @Operation(summary = "Aprobar hora extra")
    @PutMapping("/{id}/approve")
    @PreAuthorize("hasAnyRole('TEAM_LEADER', 'MASTER')")
    public ResponseEntity<ExtraHourDTO> approveExtraHour(@PathVariable Long id) {
        ExtraHour approvedHour = extraHourService.updateStatus(id, ExtraHourStatus.APROBADO);
        return ResponseEntity.ok(ExtraHourDTO.fromEntity(approvedHour));
    }

    @Operation(summary = "Rechazar hora extra")
    @PutMapping("/{id}/reject")
    @PreAuthorize("hasAnyRole('TEAM_LEADER', 'MASTER')")
    public ResponseEntity<ExtraHourDTO> rejectExtraHour(@PathVariable Long id) {
        ExtraHour rejectedHour = extraHourService.updateStatus(id, ExtraHourStatus.RECHAZADO);
        return ResponseEntity.ok(ExtraHourDTO.fromEntity(rejectedHour));
    }

    @Operation(summary = "Obtener resumen de horas extra por empleado")
    @GetMapping("/summary")
    public ResponseEntity<Map<String, Object>> getExtraHourSummary(
            @RequestParam Long employeeId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {

        Map<String, Object> summary = extraHourService.getExtraHourSummary(employeeId, startDate, endDate);
        return ResponseEntity.ok(summary);
    }

    @Operation(summary = "Eliminar hora extra")
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('MASTER')")
    public ResponseEntity<Void> deleteExtraHour(@PathVariable Long id) {
        extraHourService.deleteExtraHour(id);
        return ResponseEntity.noContent().build();
    }
}















