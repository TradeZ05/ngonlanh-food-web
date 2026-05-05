package com.ngonlanh.backend.controller;

import com.ngonlanh.backend.dto.CheckoutRequest;
import com.ngonlanh.backend.entity.Order;
import com.ngonlanh.backend.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import java.util.Map;
import com.ngonlanh.backend.repository.OrderRepository;

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

    // Thêm dòng này để Controller gọi thẳng CSDL cho lẹ
    @Autowired
    private OrderRepository orderRepository;

    // ==========================================
    // 1. API CHO ADMIN: Lấy tất cả đơn hàng (Có phân trang)
    // ==========================================
    @GetMapping
    public ResponseEntity<?> getAllOrdersForAdmin(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String status) {
        try {
            // Sắp xếp đơn hàng mới nhất lên đầu
            Pageable pageable = PageRequest.of(page, size, Sort.by("orderDate").descending());
            Page<Order> orderPage;

            // Nếu JS có gửi status thì lọc, không thì lấy hết
            if (status != null && !status.isEmpty()) {
                // Tạm thời gọi findAll để lấy hết (nếu Repo chưa có hàm findByStatus phân trang)
                orderPage = orderRepository.findAll(pageable); 
            } else {
                orderPage = orderRepository.findAll(pageable);
            }

            return ResponseEntity.ok(orderPage);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi tải danh sách đơn hàng: " + e.getMessage());
        }
    }

    // ==========================================
    // 2. API CHO ADMIN: Cập nhật trạng thái đơn
    // ==========================================
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateOrderStatus(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        try {
            String newStatus = payload.get("status");
            
            // Tìm đơn hàng trong DB
            Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy mã đơn: " + id));
            
            // Cập nhật trạng thái và lưu lại
            order.setStatus(newStatus);
            orderRepository.save(order);

            return ResponseEntity.ok().body(Map.of("message", "Cập nhật thành công!"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi cập nhật: " + e.getMessage());
        }
    }
}