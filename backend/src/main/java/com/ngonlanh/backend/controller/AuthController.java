package com.ngonlanh.backend.controller;

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

    // API Đăng ký tài khoản
    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterRequest request) {
        String result = authService.register(request);
        
        // Nếu kết quả trả về có chữ "Lỗi", trả về HTTP Status 400 (Bad Request)
        if (result.startsWith("Lỗi")) {
            return ResponseEntity.badRequest().body(result);
        }
        
        // Thành công trả về HTTP Status 200 (OK)
        return ResponseEntity.ok(result);
    }
    
    @Autowired
    private AuthenticationManager authenticationManager;

    // API Đăng nhập
    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginRequest request) {
        try {
            // Ném username và password cho AuthenticationManager xử lý
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
            );
            
            // Lưu thông tin đăng nhập vào Context (Phiên làm việc hiện tại)
            SecurityContextHolder.getContext().setAuthentication(authentication);
            
            return ResponseEntity.ok("Đăng nhập thành công!");
        } catch (Exception e) {
            // Nếu sai tài khoản hoặc mật khẩu, Spring Security sẽ ném lỗi, ta bắt lại và trả về 400
            return ResponseEntity.badRequest().body("Lỗi: Sai tên đăng nhập hoặc mật khẩu!");
        }
    }
}