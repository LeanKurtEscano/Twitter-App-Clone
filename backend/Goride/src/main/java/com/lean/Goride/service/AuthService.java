package com.lean.Goride.service;


import com.lean.Goride.dto.RegisterDto;
import com.lean.Goride.model.User;
import com.lean.Goride.repo.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepo;


    public void registerUser(RegisterDto dto) {

        User user = new User();
        user.setUsername(dto.getName());
        user.setEmail(dto.getEmail());
        user.setClerkId(dto.getClerkId());
        userRepo.save(user);
    }
}
