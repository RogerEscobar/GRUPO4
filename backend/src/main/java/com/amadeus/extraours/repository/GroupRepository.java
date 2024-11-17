package com.amadeus.extraours.repository;


import com.amadeus.extraours.model.Group;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface GroupRepository extends JpaRepository<Group, Long> {
    Optional<Group> findByLeaderId(Long leaderId);

    @Query("SELECT g FROM Group g WHERE :employeeId MEMBER OF g.employeeIds")
    Optional<Group> findByEmployeeId(@Param("employeeId") Long employeeId);

    boolean existsByLeaderId(Long leaderId);

}
