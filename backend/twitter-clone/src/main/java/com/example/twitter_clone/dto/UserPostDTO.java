package com.example.twitter_clone.dto;

import lombok.Data;

@Data
public class UserPostDTO {

    private Long id;
    private String firstName;
    private String lastName;
    private String username;
    private String profilePicture;

}
