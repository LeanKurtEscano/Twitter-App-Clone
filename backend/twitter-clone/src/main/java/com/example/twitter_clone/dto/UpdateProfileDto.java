package com.example.twitter_clone.dto;


import lombok.Data;

@Data
public class UpdateProfileDto {

    private String firstName;
    private String lastName;
    private String bio;
    private  String location;
}
