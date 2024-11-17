package com.amadeus.extraours.controller;


import com.amadeus.extraours.dto.response.UserDTO;
import com.amadeus.extraours.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    @PreAuthorize("hasRole('MASTER')")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('MASTER', 'TEAM_LEADER')")
    public ResponseEntity<UserDTO> getUserById(@PathVariable Long id){
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @PutMapping("/{id}/activate")
    @PreAuthorize("hasRole('MASTER')")
    public ResponseEntity<UserDTO> activateUser(@PathVariable Long id){
        return ResponseEntity.ok(userService.activateUser(id));
    }

    @PutMapping("/{id}/deactivate")
    @PreAuthorize("hasRole('MASTER')")
    public ResponseEntity<UserDTO> deactivateUser(@PathVariable Long id){
        return ResponseEntity.ok(userService.deactivateUser(id));
    }



}
