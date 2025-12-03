package com.readhub.bookmanagement.dto;

import lombok.Data;

@Data
public class UserUpdateDto {
    private String firstName;
    private String lastName;
    private String password; // Optional: user might not want to change it
}