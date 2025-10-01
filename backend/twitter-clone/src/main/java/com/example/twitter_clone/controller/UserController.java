package com.example.twitter_clone.controller;

import com.example.twitter_clone.dto.UpdateProfileDto;
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
    public ResponseEntity<?> updateProfile(@PathVariable String clerkId, @RequestBody UpdateProfileDto dto) {
     // to be built once frontend is finalized

        userService.updateUser(clerkId,dto);

        return ResponseEntity.ok("User Profile Updated");
    }


    @PostMapping("/{userId}/follow/{targetId}")
    public ResponseEntity<?> followUser(@PathVariable Long userId, @PathVariable Long targetId) {
        System.out.println(userId);
        System.out.println(targetId);
        userService.followUser(userId, targetId);
        return ResponseEntity.ok("User Followed");
    }


     @GetMapping("/{userId}/followers")
    public ResponseEntity<?> getFollowers(@PathVariable Long userId) {
        return ResponseEntity.ok(userService.getFollowers(userId));
    }

    @GetMapping("/{userId}/following")
    public ResponseEntity<?> getFollowing(@PathVariable Long userId) {
        return ResponseEntity.ok(userService.getFollowing(userId));
    }


    @GetMapping("/search")
    public ResponseEntity<?> searchUsers(@RequestParam String query) {
        System.out.println("User");
        System.out.println(query);
        List<User> users = userService.searchUsersByUsername(query);

        System.out.println(users);
        return ResponseEntity.ok(users);
    }


}
