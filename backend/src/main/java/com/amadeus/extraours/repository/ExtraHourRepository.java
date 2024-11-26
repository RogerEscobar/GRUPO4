package com.amadeus.extraours.repository;


import com.amadeus.extraours.model.ExtraHour;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ExtraHourRepository extends JpaRepository <ExtraHour, Long>, JpaSpecificationExecutor<ExtraHour> {

    // Método para buscar por rango
    @Query("SELECT e FROM ExtraHour e WHERE " +
            "(:employeeId IS NULL OR e.employeeId = :employeeId) AND " +
            "(:startDate IS NULL OR e.startDateTime >= :startDate) AND " +
            "(:endDate IS NULL OR e.endDateTime <= :endDate)")
    Page<ExtraHour> findByFilters(
            @Param("employeeId") Long employeeId,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate,
            Pageable pageable);

    // Verifica si existen horas extra solapadas para un empleado
    @Query("SELECT CASE WHEN COUNT(e) > 0 THEN true ELSE false END FROM ExtraHour e " +
            "WHERE e.employeeId = :employeeId " +
            "AND ((e.startDateTime BETWEEN :start AND :end) " +
            "OR (e.endDateTime BETWEEN :start AND :end))")
    boolean existsOverlappingHours(
            @Param("employeeId") Long employeeId,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end);

    // Obtiene todas las horas extra de un empleado
    List<ExtraHour> findByEmployeeId(Long employeeId);

    // Calcula el total de horas para un empleado en un período
    @Query("SELECT COALESCE(SUM(e.hours), 0) FROM ExtraHour e " +
            "WHERE e.employeeId = :employeeId " +
            "AND e.startDateTime >= :startDate " +
            "AND e.endDateTime <= :endDate")
    Double getTotalHoursByEmployeeAndPeriod(
            @Param("employeeId") Long employeeId,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);
}
