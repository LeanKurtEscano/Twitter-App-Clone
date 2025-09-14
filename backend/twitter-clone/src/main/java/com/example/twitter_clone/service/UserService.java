package com.example.twitter_clone.service;

import com.example.twitter_clone.dto.UserDTO;
import com.example.twitter_clone.exception.NotFoundException;
import com.example.twitter_clone.model.User;
import com.example.twitter_clone.repo.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {



    @Autowired
    private UserRepository userRepo;


    public User getByUsername(String username) {
        return userRepo.findByUsername(username).orElseThrow(() -> new NotFoundException("User not found: " + username));
    }


    public void followUser(Long userId, Long targetId) {
        User user = userRepo.findById(userId).orElseThrow();
        User target = userRepo.findById(targetId).orElseThrow();

        user.getFollowing().add(target);
        userRepo.save(user);
    }

    public void unfollowUser(Long userId, Long targetId) {
        User user = userRepo.findById(userId).orElseThrow();
        User target = userRepo.findById(targetId).orElseThrow();

        user.getFollowing().remove(target);
        userRepo.save(user);
    }


    public List<UserDTO> getFollowers(Long userId) {

        User user = userRepo.findById(userId)
                .orElseThrow(() -> new NotFoundException("User not found: " + userId));

        return user.getFollowing().stream()
                .map(u -> new UserDTO(u.getId(), u.getUsername(), u.getProfilePicture()))
                .collect(Collectors.toList());
    }

    public List<UserDTO> getFollowing(Long userId) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new NotFoundException("User not found: " + userId));

        return user.getFollowing().stream()
                .map(u -> new UserDTO(u.getId(), u.getUsername(), u.getProfilePicture()))
                .collect(Collectors.toList());
    }



}


