package com.amadeus.extraours.model;


import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.HashSet;
import java.util.Set;


@Entity
@Table(name = "user_groups")

public class Group {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "El nombre del grupo no puede estar vacio")
    @Column(nullable = false)
    private String name;

    @NotNull(message = "El líder del grupo es requerido")
    @Column(name = "leader_id", nullable = false)
    private Long leaderId;

    @ElementCollection
    @CollectionTable (name = "group_employees",
    joinColumns = @JoinColumn(name = "group_id"))
    @Column (name = "employee_id")
    private Set<Long> employeeIds = new HashSet<>();

    //Constructor vacio
    public Group() {}

    //Constructor con parametros
    public Group(String name, Long leaderId) {
        this.name = name;
        this.leaderId = leaderId;
    }

    //Getters y Setters

    public Long getId(){
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName(){
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getLeaderId() {
        return leaderId;
    }

    public void setLeaderId( Long leaderId) {
        this.leaderId = leaderId;
    }

    public Set<Long> getEmployeeIds() {
        return employeeIds;
    }

    public void setEmployeeIds(Set<Long> employeeIds) {
        this.employeeIds = employeeIds;
    }

    //Metodos
    public void addEmployee(Long employeeId) {
        employeeIds.add(employeeId);
    }

    public void removeEmployee(Long employeeId) {
        employeeIds.remove(employeeId);
    }
}
