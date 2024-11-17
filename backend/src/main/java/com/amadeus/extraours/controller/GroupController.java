package com.amadeus.extraours.controller;


import com.amadeus.extraours.dto.request.CreateGroupRequest;
import com.amadeus.extraours.dto.response.GroupDTO;
import com.amadeus.extraours.model.Group;
import com.amadeus.extraours.service.GroupService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/groups")
@PreAuthorize("hasRole('MASTER')")
@CrossOrigin(origins = "http://localhost:5173")
public class GroupController {

    private final GroupService groupService;

    @Autowired
    public GroupController(GroupService groupService) {

        this.groupService = groupService;
    }

    @Operation(summary = "Crear nuevo grupo")
    @PostMapping
    public ResponseEntity<GroupDTO> createGroup(@Valid @RequestBody CreateGroupRequest request){
        Group createdGroup = groupService.createGroup(request.getName(), request.getLeaderId());
        return ResponseEntity.ok(GroupDTO.fromEntity(createdGroup));
    }

    @Operation(summary = "Obtener todos los grupos")
    @GetMapping
    public  ResponseEntity<List<GroupDTO>> getAllGroups(){
        List<Group> groups = groupService.getAllGroups();
        List<GroupDTO> dtos = groups.stream()
                .map(GroupDTO::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @Operation(summary = "Obtener grupo por ID")
    @GetMapping("/{id}")
    public ResponseEntity<GroupDTO> getGroupById(@PathVariable Long id) {
        Group group = groupService.getGroupById(id);
        return ResponseEntity.ok(GroupDTO.fromEntity(group));
    }

    @Operation(summary = "Agregar empleado a grupo")
    @PostMapping("/{groupId}/employees/{employeeId}")
    public ResponseEntity<GroupDTO>addEmployeeToGroup(
            @PathVariable Long groupId,
            @PathVariable Long employeeId) {
        Group updatedgroup = groupService.addEmployeeToGroup(groupId, employeeId);
        return ResponseEntity.ok(GroupDTO.fromEntity(updatedgroup));
    }

    @Operation(summary = "Remover empleado de grupo")
    @DeleteMapping("/{groupId}/employees/{employeeId}")
    public ResponseEntity<GroupDTO>removeEmployeeFromGroup(
            @PathVariable Long groupId,
            @PathVariable Long employeeId) {
        Group updatedGroup = groupService.removeEmployeeFromGroup(groupId, employeeId);
        return ResponseEntity.ok(GroupDTO.fromEntity(updatedGroup));
    }

    @Operation(summary = "Obtener grupo por líder")
    @GetMapping("/by-leader/{leaderId}")
    public ResponseEntity<GroupDTO> getGroupByLeader(@PathVariable Long leaderId) {
        Group group = groupService.getGroupByLeader(leaderId);
        return ResponseEntity.ok(GroupDTO.fromEntity(group));
    }

    @Operation(summary = "Obtener grupo por empleado")
    @GetMapping("/by-employee/{employeeId}")
    public ResponseEntity<GroupDTO> getGroupByEmployee(@PathVariable Long employeeId) {
        Group group = groupService.findByEmployeeId(employeeId);
        return ResponseEntity.ok(GroupDTO.fromEntity(group));
    }
}
