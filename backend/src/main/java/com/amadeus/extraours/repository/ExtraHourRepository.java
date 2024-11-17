package com.amadeus.extraours.repository;


import com.amadeus.extraours.model.ExtraHour;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ExtraHourRepository extends JpaRepository <ExtraHour, Long> {

    //metodo busqueda paginada por id
    Page<ExtraHour> findByEmployeeId(Long employeeID, Pageable pageable);

    //metodo para busqueda simple por id
    List<ExtraHour> findByEmployeeId(Long employeeId);

    //metodo para verificar horas superpuestas
    @Query("SELECT COUNT(e) > 0 FROM ExtraHour e WHERE e.employeeId = :employeeId " +
    "AND ((e.startDateTime BETWEEN :start AND :end) " +
    "OR (e.endDateTime BETWEEN :start AND :end))")
    boolean existsOverlappingHours(
            @Param("employeeId") Long employeeId,
            @Param("start")LocalDateTime start,
            @Param("end") LocalDateTime end);

    //Metodo para obtener horas totales por empleado y perido
    @Query("SELECT SUM(e.hours) FROM ExtraHour e WHERE e.employeeId = :employeeId " +
    "AND e.startDateTime >= :start " +
            "AND e.endDateTime <= :end")
    Double getTotalHoursByEmployeeAndPeriod(
            @Param("employeeId") Long employeeId,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end);

    //Metodo para buscar por rango
    @Query("SELECT e FROM ExtraHour e WHERE " +
    "(:employeeId IS NULL OR e.employeeId = :employeeId) AND " +
    "(:startDate IS NULL OR e.startDateTime >= :startDate) AND " +
    "(:endDate IS NULL OR e.endDateTime <= :endDate)")
    Page<ExtraHour> findByFilters(
            @Param("employeeId") Long employeeId,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate,
            Pageable pageable);
}
