package com.example.twitter_clone.dto;


import lombok.Data;


@Data
public class ChatMessageDTO {
    // Getters and Setters
    private String fromId;
    private String toId;
    private String content;
    private long timestamp;


    @Override
    public String toString() {
        return "ChatMessageDTO{" +
                "fromId='" + fromId + '\'' +
                ", toId='" + toId + '\'' +
                ", content='" + content + '\'' +
                ", timestamp=" + timestamp +
                '}';
    }
}
