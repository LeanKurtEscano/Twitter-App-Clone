package com.example.twitter_clone.repo;

import com.example.twitter_clone.model.Follow;
import com.example.twitter_clone.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FollowRepository extends JpaRepository<Follow, Long> {




    Optional<Follow> findByFollowerAndFollowed(User follower, User followed);
}
