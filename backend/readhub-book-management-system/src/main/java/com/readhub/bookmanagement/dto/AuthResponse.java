package com.readhub.bookmanagement.dto;

import com.readhub.bookmanagement.model.User;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private User user;
}
