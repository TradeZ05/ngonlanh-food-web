package com.ngonlimage.backend.controller;

import com.ngonlimage.backend.dto.CheckoutRequest;
import com.ngonlimage.backend.entity.Order;
import com.ngonlimage.backend.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping("/checkout")
    public ResponseEntity<?> checkout(@RequestBody CheckoutRequest request) {
        try {
            // Lấy username của khách từ Token bảo mật
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String username = auth.getName();

            // Nhờ Service chốt đơn
            Order newOrder = orderService.placeOrder(username, request);

            return ResponseEntity.ok("Chốt đơn thành công! Mã đơn: " + newOrder.getId() + 
                                     " | Tổng tiền: " + newOrder.getTotalPrice());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi đặt hàng: " + e.getMessage());
        }
    }

    @GetMapping("/history")
    public ResponseEntity<?> getOrderHistory() {
        try {
            // Lấy username từ Token
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String username = auth.getName();

            // Gọi Service lấy dimage sách đơn
            List<Order> history = orderService.getOrderHistory(username);
            
            return ResponseEntity.ok(history);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi lấy lịch sử: " + e.getMessage());
        }
    }
}