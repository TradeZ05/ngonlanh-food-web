package com.ngonlanh.backend.controller;

import com.ngonlanh.backend.config.JwtTokenProvider;
import com.ngonlanh.backend.dto.JwtAuthResponse;
import com.ngonlanh.backend.dto.LoginRequest;
import com.ngonlanh.backend.dto.RegisterRequest;
import com.ngonlanh.backend.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private AuthenticationManager authenticationManager;

    // 1. Gắn thêm máy phát Token vào đây
    @Autowired
    private JwtTokenProvider tokenProvider; 

    // API Đăng ký tài khoản (Giữ nguyên)
    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterRequest request) {
        String result = authService.register(request);
        
        if (result.startsWith("Lỗi")) {
            return ResponseEntity.badRequest().body(result);
        }
        
        return ResponseEntity.ok(result);
    }
    
    // API Đăng nhập (Đã sửa đổi)
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) { // Đổi <String> thành <?>
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
            );
            
            SecurityContextHolder.getContext().setAuthentication(authentication);
            
            // 2. Nhờ máy phát Token tạo ra một chuỗi mã hóa
            String jwt = tokenProvider.generateToken(authentication);
            
            // 3. Bỏ chuỗi mã hóa đó vào cái rổ JwtAuthResponse và trả về cho Postman
            return ResponseEntity.ok(new JwtAuthResponse(jwt));
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi: Sai tên đăng nhập hoặc mật khẩu!");
        }
    }
}