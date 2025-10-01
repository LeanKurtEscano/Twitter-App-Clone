package com.example.twitter_clone.repo;


import com.example.twitter_clone.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByUsername(String username);
    Optional<User> findByClerkId(String clerkId);

    List<User> findByUsernameContainingIgnoreCaseOrderByCreatedAtDesc(String keyword);
}