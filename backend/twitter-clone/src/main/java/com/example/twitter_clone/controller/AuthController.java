package com.example.twitter_clone.controller;


import com.example.twitter_clone.dto.SyncDTO;
import com.example.twitter_clone.repo.UserRepository;
import com.example.twitter_clone.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;
    
    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody SyncDTO dto) {
        userService.registerUser(dto);
        return ResponseEntity.ok(" User Successfully registered");
    }

}