package com.example.twitter_clone.dto;


import lombok.Data;

@Data
public class RetweetDTO {
    private Long userId;
    private String comment; // optional (for quote-retweet)
}