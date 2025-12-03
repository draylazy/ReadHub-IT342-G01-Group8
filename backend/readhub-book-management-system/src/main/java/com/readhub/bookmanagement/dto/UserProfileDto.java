package com.readhub.bookmanagement.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserProfileDto {
    private Long userId;
    private String firstName;
    private String lastName;
    private String email;
    private String role;
    private String avatarUrl; // Added for profile image feature
}