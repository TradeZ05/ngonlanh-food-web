package com.ngonlanh.backend.service;

import com.ngonlanh.backend.dto.RegisterRequest;
import com.ngonlanh.backend.entity.Role;
import com.ngonlanh.backend.entity.User;
import com.ngonlanh.backend.repository.RoleRepository;
import com.ngonlanh.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public String register(RegisterRequest request) {
        // 1. Kiểm tra xem username hoặc email đã tồn tại chưa
        if (userRepository.existsByUsername(request.getUsername())) {
            return "Lỗi: Username đã được sử dụng!";
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            return "Lỗi: Email đã được sử dụng!";
        }

        // 2. Tạo đối tượng User mới từ dữ liệu DTO gửi lên
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setFullName(request.getFullName());
        
        // Mã hóa mật khẩu trước khi lưu
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        // 3. Phân quyền mặc định là ROLE_USER
        Set<Role> roles = new HashSet<>();
        Role userRole = roleRepository.findByName("ROLE_USER")
                .orElseGet(() -> {
                    // Nếu trong database chưa có quyền ROLE_USER thì tự động tạo mới
                    Role newRole = new Role();
                    newRole.setName("ROLE_USER");
                    return roleRepository.save(newRole);
                });
        roles.add(userRole);
        user.setRoles(roles);

        // 4. Lưu vào cơ sở dữ liệu
        userRepository.save(user);

        return "Đăng ký tài khoản thành công!";
    }
}