package com.amadeus.extraours.service;


import com.amadeus.extraours.dto.response.GroupDTO;
import com.amadeus.extraours.model.Group;
import com.amadeus.extraours.model.User;
import com.amadeus.extraours.model.UserRole;
import com.amadeus.extraours.repository.GroupRepository;
import com.amadeus.extraours.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class GroupService {

    private final GroupRepository groupRepository;

    @Autowired
    public GroupService(GroupRepository groupRepository) {
        this.groupRepository = groupRepository;
    }

    @Transactional
    public Group createGroup(String name, Long leaderId) {
        Group group = new Group();
        group.setName(name);
        group.setLeaderId(leaderId);
        return groupRepository.save(group);
    }

    public List<Group> getAllGroups() {
        return groupRepository.findAll();
    }

    public Group getGroupById(Long id) {
        return groupRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Grupo no encontrado"));
    }

    public Group findByEmployeeId(Long employeeId) {
        return groupRepository.findByEmployeeId(employeeId)
                .orElseThrow(() -> new RuntimeException("Grupo no encontrado para el empleado"));
    }

    @Transactional
    public Group addEmployeeToGroup(Long groupId, Long employeeId) {
        Group group = getGroupById(groupId);
        group.getEmployeeIds().add(employeeId);
        return groupRepository.save(group);
    }

    @Transactional
    public Group removeEmployeeFromGroup(Long groupId, Long employeeId) {
        Group group = getGroupById(groupId);
        group.getEmployeeIds().remove(employeeId);
        return groupRepository.save(group);
    }

    public Group getGroupByLeader(Long leaderId) {
        return groupRepository.findByLeaderId(leaderId)
                .orElseThrow(() -> new RuntimeException("Grupo no encontrado para el líder"));
    }
}
