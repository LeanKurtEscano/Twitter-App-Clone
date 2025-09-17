package com.example.twitter_clone.dto;

import lombok.Data;

@Data
public class PostDTO {
    private String clerkUserId;
    private String content;
    private String image; // optional URL string
}