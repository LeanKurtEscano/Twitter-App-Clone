package com.example.twitter_clone.dto;


import lombok.Data;

@Data
public class SyncDTO {

    private String clerkUserId;
    private String email;
    private String firstName;
    private String lastName;
    private String profileImage;
    private String provider;
}
