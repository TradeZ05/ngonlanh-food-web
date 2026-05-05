package com.ngonlanh.backend.controller;

import com.ngonlanh.backend.dto.DashboardResponse; // Import đúng đường dẫn của ní nha
import com.ngonlanh.backend.service.DashboardService; // Import đúng đường dẫn
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    @GetMapping("/stats")
    public ResponseEntity<?> getDashboardStats() {
        try {
            // Lưu ý: Sửa lại tên hàm getStats() cho đúng với tên hàm ní đã viết trong DashboardService
            DashboardResponse stats = dashboardService.getDashboardStats(); 
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi lấy dữ liệu thống kê: " + e.getMessage());
        }
    }
}