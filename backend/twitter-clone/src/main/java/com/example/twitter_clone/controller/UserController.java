package com.example.twitter_clone.controller;

import com.example.twitter_clone.dto.UserDTO;
import com.example.twitter_clone.model.User;
import com.example.twitter_clone.service.UserService;
import org.apache.coyote.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user")
public class UserController {


    @Autowired
    private UserService userService;



    @GetMapping("/profile/{username}")
    public ResponseEntity<?> getUserProfile(@RequestParam String username) {
        User user = userService.getByUsername(String.valueOf(username));
        return  ResponseEntity.ok(username);
    }
    @GetMapping("/me/{clerkId}")
    public ResponseEntity<?> getCurrentUser(@PathVariable String clerkId){

        User user = userService.getCurrentUser(clerkId);
        return ResponseEntity.ok(user);

    }


    @PutMapping("/profile/{clerkId}")
    public ResponseEntity<?> updateProfile(@RequestParam String clerkId) {
     // to be built once frontend is finalized

        return ResponseEntity.ok("dsdd");
    }


    @PostMapping("/{userId}/follow/{targetId}")
    public ResponseEntity<?> followUser(@PathVariable Long userId, @PathVariable Long targetId) {
        userService.followUser(userId, targetId);
        return ResponseEntity.ok("User Followed");
    }

    @PostMapping("/{userId}/unfollow/{targetId}")
    public ResponseEntity<?> unfollowUser(@PathVariable Long userId, @PathVariable Long targetId) {
        userService.unfollowUser(userId, targetId);
        return ResponseEntity.ok("User unfollowed");
    }


    @GetMapping("/{userId}/followers")
    public ResponseEntity<List<UserDTO>> getFollowers(@PathVariable Long userId) {
        return ResponseEntity.ok(userService.getFollowers(userId));
    }

    @GetMapping("/{userId}/following")
    public ResponseEntity<List<UserDTO>> getFollowing(@PathVariable Long userId) {
        return ResponseEntity.ok(userService.getFollowing(userId));
    }


}
