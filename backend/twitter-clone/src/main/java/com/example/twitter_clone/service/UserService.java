package com.example.twitter_clone.service;

import com.example.twitter_clone.controller.NotificationController;
import com.example.twitter_clone.dto.SyncDTO;
import com.example.twitter_clone.dto.UpdateProfileDto;
import com.example.twitter_clone.dto.UserDTO;
import com.example.twitter_clone.exception.NotFoundException;
import com.example.twitter_clone.model.Follow;
import com.example.twitter_clone.model.Notification;
import com.example.twitter_clone.model.User;
import com.example.twitter_clone.repo.FollowRepository;
import com.example.twitter_clone.repo.NotificationRepository;
import com.example.twitter_clone.repo.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserService {



    @Autowired
    private UserRepository userRepo;

    @Autowired
    private FollowRepository followRepo;

    @Autowired
    private NotificationRepository notificationRepo;


    @Autowired
    private NotificationController notificationController;

    public void registerUser(SyncDTO dto) {
           boolean user = userRepo.findByClerkId(dto.getClerkUserId()).isPresent();
           if(!user) {
               User newUser = new User();

               String username  = dto.getFirstName() + " " +  dto.getLastName();
               newUser.setClerkId(dto.getClerkUserId());
               newUser.setEmail(dto.getEmail());
               newUser.setFirstName(dto.getFirstName());
               newUser.setLastName(dto.getLastName());
               newUser.setProfilePicture(dto.getProfileImage());
               newUser.setProvider(dto.getProvider());
               newUser.setUsername(username);

               userRepo.save(newUser);
           }
    }


    public User getByUsername(String username) {
        return userRepo.findByUsername(username).orElseThrow(() -> new NotFoundException("User not found: " + username));
    }


    @Transactional
    public void followUser(Long followerId, Long followedId) {
        User follower = userRepo.findById(followerId)
                .orElseThrow(() -> new RuntimeException("Follower not found"));
        User followed = userRepo.findById(followedId)
                .orElseThrow(() -> new RuntimeException("User to follow not found"));

        Optional<Follow> existingFollow = followRepo.findByFollowerAndFollowed(follower, followed);

        if (existingFollow.isPresent()) {
            // 🔹 Unfollow logic
            Follow follow = existingFollow.get();
            followRepo.delete(follow);

            follower.getFollowing().remove(follow);
            followed.getFollowers().remove(follow);

            notificationRepo.deleteByFromAndToAndType(follower,followed , "follow");

        } else {
            // 🔹 Follow logic
            Follow follow = new Follow();
            follow.setFollower(follower);
            follow.setFollowed(followed);



            // maintain both sides
            follower.getFollowing().add(follow);
            followed.getFollowers().add(follow);

            followRepo.save(follow);


            Notification notification = Notification.builder()
                    .from(follower)
                    .to(followed)
                    .type("follow")
                    .build();

            notificationRepo.save(notification);


            notificationController.sendNotificationToUser(String.valueOf(followerId), notification);
        }
    }




    public User getCurrentUser(String clerkId) {
        return  userRepo.findByClerkId(clerkId).orElseThrow(
                () -> new NotFoundException("User not found"));

    }

    public User getUserByUsername(String username) {
        return  userRepo.findByUsername(username).orElseThrow(
                () -> new NotFoundException("User not found"));

    }


    public void updateUser(String clerkId, UpdateProfileDto dto) {

        User user = userRepo.findByClerkId(clerkId).orElseThrow(() ->
                new NotFoundException("User not found" + clerkId));

             user.setFirstName(dto.getFirstName());
             user.setLastName(dto.getLastName());
             user.setBio(dto.getBio());
             user.setLocation(dto.getLocation());

             userRepo.save(user);

    }




    public List<User> getFollowers(Long id) {
        User user = userRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return followRepo.findFollowersByUserId(user.getId());
    }

    /**
     * Get all users that a specific user is following (following)
     */
    public List<User> getFollowing(Long clerkId) {
        User user = userRepo.findById(clerkId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return followRepo.findFollowingByUserId(user.getId());
    }


    public List<User> searchUsersByUsername(String keyword) {
        return userRepo.findByUsernameContainingIgnoreCaseOrderByCreatedAtDesc(keyword);
    }


}


