package com.ngonlimage.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class JwtAuthResponse {
    private String accessToken;
    private String tokenType = "Bearer";
    
    // Thêm 2 trường này để chứa thông tin trả về cho Frontend
    private String username;
    private String email;

    // Hàm khởi tạo 3 tham số để khớp với AuthController
    public JwtAuthResponse(String accessToken, String username, String email) {
        this.accessToken = accessToken;
        this.username = username;
        this.email = email;
    }
}