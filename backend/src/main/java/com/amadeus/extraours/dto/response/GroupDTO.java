package com.amadeus.extraours.dto.response;

import com.amadeus.extraours.model.Group;

import java.util.HashSet;
import java.util.Set;

public class GroupDTO {
    private Long id;
    private String name;
    private Long leaderId;
    private Set<Long> employeeIds = new HashSet<>();

    //Constructor
    public GroupDTO() {
    }

    //Constructor con parametros
    public GroupDTO(Long id, String name, Long leaderId, Set<Long> employeeIds) {
        this.id = id;
        this.name = name;
        this.leaderId = leaderId;
        this.employeeIds = employeeIds;
    }

    //Getters y Setters
    public Long getId(){
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getLeaderId() {
        return leaderId;
    }

    public void setLeaderId(Long leaderId) {
        this.leaderId = leaderId;
    }

    public Set<Long> getEmployeeIds() {
        return employeeIds;
    }

    public void setEmployeeIds(Set<Long> employeeIds) {
        this.employeeIds = employeeIds != null ? employeeIds : new HashSet<>();
    }


    //Metodo para convertir entity a DTO
    public static GroupDTO fromEntity(Group group) {
        return new GroupDTO(
                group.getId(),
                group.getName(),
                group.getLeaderId(),
                group.getEmployeeIds()
        );
    }

    //Metodo para convertir de DTO a Entity
    public Group toEntity() {
        Group group = new Group(this.name, this.leaderId);
        group.setId(this.id);
        group.setEmployeeIds(this.employeeIds);
        return group;
    }
}
