package com.lean.Goride.controller;


import com.lean.Goride.dto.RegisterDto;
import com.lean.Goride.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(RegisterDto dto) {
        authService.registerUser(dto);
    return (ResponseEntity<?>) ResponseEntity.status(HttpStatus.CREATED);
    }
}
