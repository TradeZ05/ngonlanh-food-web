package com.ngonlanh.backend.controller;

import com.ngonlanh.backend.entity.User;
import com.ngonlanh.backend.repository.UserRepository;
import com.ngonlanh.backend.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Random;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private org.springframework.security.authentication.AuthenticationManager authenticationManager;

    @Autowired
    private com.ngonlanh.backend.config.JwtTokenProvider tokenProvider;

    @Autowired
    private EmailService emailService; // Gọi tổng đài gửi mail

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody java.util.Map<String, String> loginRequest) {
        try {
            org.springframework.security.core.Authentication authentication = authenticationManager.authenticate(
                    new org.springframework.security.authentication.UsernamePasswordAuthenticationToken(
                            loginRequest.get("username"),
                            loginRequest.get("password")
                    )
            );
            
            org.springframework.security.core.context.SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = tokenProvider.generateToken(authentication);
            
            com.ngonlanh.backend.entity.User user = userRepository.findByUsername(loginRequest.get("username"))
                    .orElseThrow(() -> new RuntimeException("User not found"));

            if (!user.getIsActive()) {
                return ResponseEntity.status(org.springframework.http.HttpStatus.FORBIDDEN).body("Tài khoản chưa kích hoạt OTP!");
            }
            
            return ResponseEntity.ok(new com.ngonlanh.backend.dto.JwtAuthResponse(jwt, user.getUsername(), user.getEmail()));
            
        } catch (Exception e) {
            return ResponseEntity.status(org.springframework.http.HttpStatus.UNAUTHORIZED).body("Sai tài khoản hoặc mật khẩu!");
        }
    }
    
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        // 1. Kiểm tra username đã tồn tại chưa (Tùy logic cũ của bạn)
        if (userRepository.existsByUsername(user.getUsername())) {
            return ResponseEntity.badRequest().body("Lỗi: Username đã tồn tại!");
        }

        String passwordRegex = "^(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!]).{8,}$";
        if (!user.getPassword().matches(passwordRegex)) {
            return ResponseEntity.badRequest().body("Lỗi: Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và ký tự đặc biệt!");
        }

        // 2. Mã hóa mật khẩu
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // 3. Sinh mã OTP ngẫu nhiên 6 chữ số
        String otp = String.format("%06d", new Random().nextInt(999999));
        
        // 4. Gắn cờ trạng thái và lưu OTP vào user
        user.setEnabled(true); // THÊM DÒNG NÀY
        user.setIsActive(false); // Khóa tài khoản
        user.setOtpCode(otp);
        user.setOtpExpiryTime(LocalDateTime.now().plusMinutes(5)); // Hạn 5 phút

        // 5. Lưu xuống Database
        userRepository.save(user);

        // 6. Ra lệnh gửi Email (Dùng luồng riêng Thread để không làm chậm API)
        new Thread(() -> {
            // Giả sử user của bạn đăng nhập bằng email hoặc có trường email
            emailService.sendOtpEmail(user.getEmail(), otp); 
        }).start();

        return ResponseEntity.ok("Đăng ký thành công! Vui lòng kiểm tra email để lấy mã OTP.");
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody java.util.Map<String, String> request) {
        String username = request.get("username"); 
        String otp = request.get("otp");

        // 1. Tìm user trong Database
        // Lưu ý: Đảm bảo trong UserRepository của bạn đã khai báo hàm: Optional<User> findByUsername(String username);
        User user = userRepository.findByUsername(username).orElse(null);

        if (user == null) {
            return ResponseEntity.badRequest().body("Lỗi: Không tìm thấy tài khoản!");
        }

        // 2. Kiểm tra xem tài khoản đã kích hoạt chưa
        if (user.getIsActive()) {
            return ResponseEntity.badRequest().body("Lỗi: Tài khoản này đã được kích hoạt từ trước!");
        }

        // 3. Kiểm tra tính chính xác của mã OTP
        if (user.getOtpCode() == null || !user.getOtpCode().equals(otp)) {
            return ResponseEntity.badRequest().body("Lỗi: Mã OTP không chính xác!");
        }

        // 4. Kiểm tra thời hạn của mã OTP (Có bị quá 5 phút chưa)
        if (user.getOtpExpiryTime().isBefore(LocalDateTime.now())) {
            return ResponseEntity.badRequest().body("Lỗi: Mã OTP đã hết hạn! Vui lòng yêu cầu gửi lại mã mới.");
        }

        // 5. Nếu mọi thứ hợp lệ -> Kích hoạt tài khoản
        user.setIsActive(true);
        user.setOtpCode(null); // Xóa mã OTP để bảo mật, không cho dùng lại
        user.setOtpExpiryTime(null);
        
        userRepository.save(user);

        return ResponseEntity.ok("Xác thực OTP thành công! Tài khoản đã được kích hoạt.");
    }

    @PostMapping("/resend-otp")
    public ResponseEntity<?> resendOtp(@RequestBody java.util.Map<String, String> request) {
        String username = request.get("username");

        // 1. Tìm user trong Database
        User user = userRepository.findByUsername(username).orElse(null);

        if (user == null) {
            return ResponseEntity.badRequest().body("Lỗi: Không tìm thấy tài khoản!");
        }

        // 2. Nếu tài khoản đã kích hoạt rồi thì không cho gửi nữa
        if (user.getIsActive()) {
            return ResponseEntity.badRequest().body("Lỗi: Tài khoản này đã được kích hoạt rồi!");
        }

        // 3. Tạo mã OTP mới (6 số)
        String newOtp = String.format("%06d", new java.util.Random().nextInt(1000000));
        
        // 4. Cập nhật mã mới và thời hạn mới (thêm 5 phút) vào Database
        user.setOtpCode(newOtp);
        user.setOtpExpiryTime(java.time.LocalDateTime.now().plusMinutes(5));
        userRepository.save(user);

        // 5. Gửi email mã mới (Dùng Thread để không làm treo UI người dùng)
        new Thread(() -> {
            try {
                emailService.sendOtpEmail(user.getEmail(), newOtp);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }).start();

        return ResponseEntity.ok("Mã OTP mới đã được gửi! Vui lòng kiểm tra lại email.");
    }
}