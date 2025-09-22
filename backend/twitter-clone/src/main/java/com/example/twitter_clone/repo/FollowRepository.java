package com.example.twitter_clone.repo;

import com.example.twitter_clone.model.Follow;
import com.example.twitter_clone.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface FollowRepository extends JpaRepository<Follow, Long> {




    Optional<Follow> findByFollowerAndFollowed(User follower, User followed);


    @Query("SELECT f.follower FROM Follow f WHERE f.followed.id = :userId")
    List<User> findFollowersByUserId(@Param("userId") Long userId);

    @Query("SELECT f.followed FROM Follow f WHERE f.follower.id = :userId")
    List<User> findFollowingByUserId(@Param("userId") Long userId);
}
