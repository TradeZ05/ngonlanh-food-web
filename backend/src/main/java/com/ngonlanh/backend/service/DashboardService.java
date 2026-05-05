package com.ngonlanh.backend.service;

import com.ngonlanh.backend.dto.DashboardResponse;
import com.ngonlanh.backend.entity.Order;
import com.ngonlanh.backend.repository.OrderRepository;
import com.ngonlanh.backend.repository.ProductRepository;
import com.ngonlanh.backend.repository.UserRepository; // Import thêm cái này
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.TemporalAdjusters;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DashboardService {
    @Autowired private OrderRepository orderRepository;
    @Autowired private ProductRepository productRepository;
    @Autowired private UserRepository userRepository; // Tiêm UserRepository vào đây

    public DashboardResponse getDashboardStats() {
        DashboardResponse response = new DashboardResponse();
        
        List<String> paidStatuses = Arrays.asList("PAID", "DELIVERED", "COMPLETED");

        LocalDate today = LocalDate.now();
        LocalDateTime startOfDay = today.atStartOfDay();
        LocalDateTime endOfDay = today.atTime(LocalTime.MAX);

        LocalDateTime startOfMonth = today.with(TemporalAdjusters.firstDayOfMonth()).atStartOfDay();
        LocalDateTime endOfMonth = today.with(TemporalAdjusters.lastDayOfMonth()).atTime(LocalTime.MAX);

        Double todayRev = orderRepository.calculateRevenue(paidStatuses, startOfDay, endOfDay);
        response.setTodayRevenue(todayRev != null ? todayRev : 0.0);

        Double monthRev = orderRepository.calculateRevenue(paidStatuses, startOfMonth, endOfMonth);
        response.setMonthlyRevenue(monthRev != null ? monthRev : 0.0);

        response.setNewOrdersCount(orderRepository.countByStatus("PENDING"));
        response.setTotalProducts(productRepository.count());
        
        // 🚀 CẬP NHẬT CHÍNH XÁC SỐ ĐƠN VÀ SỐ KHÁCH VÀO ĐÂY
        response.setTotalOrders(orderRepository.count());
        response.setTotalCustomers(userRepository.count());

        // ==========================================================
        // 🚀 TÍNH TOÁN DỮ LIỆU BIỂU ĐỒ DOANH THU 7 NGÀY QUA
        // ==========================================================
        List<Double> revenueLast7Days = new ArrayList<>();
        List<String> labelsLast7Days = new ArrayList<>();
        // Định dạng ngày hiển thị (VD: "15/04")
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM");

        // Vòng lặp đếm ngược từ 6 ngày trước về hôm nay (Tổng cộng 7 vòng)
        for (int i = 6; i >= 0; i--) {
            LocalDate targetDate = today.minusDays(i);
            labelsLast7Days.add(targetDate.format(formatter));

            // Tính doanh thu của từng ngày một
            LocalDateTime start = targetDate.atStartOfDay();
            LocalDateTime end = targetDate.atTime(LocalTime.MAX);
            Double dailyRev = orderRepository.calculateRevenue(paidStatuses, start, end);
            revenueLast7Days.add(dailyRev != null ? dailyRev : 0.0);
        }

        // Đổ mảng dữ liệu vào Khay
        response.setLabelsLast7Days(labelsLast7Days);
        response.setRevenueLast7Days(revenueLast7Days);
        // ==========================================================

        List<Order> recentOrders = orderRepository.findTop5ByOrderByOrderDateDesc();
        List<DashboardResponse.OrderSummaryDTO> orderDTOs = recentOrders.stream().map(order -> {
            DashboardResponse.OrderSummaryDTO dto = new DashboardResponse.OrderSummaryDTO();
            dto.setOrderCode("#ORD-" + String.format("%03d", order.getId()));
            
            // Check null user để tránh lỗi 500 nếu khách vãng lai đặt hàng
            dto.setCustomerName(order.getUser() != null ? order.getUser().getUsername() : "Khách vãng lai"); 
            
            dto.setTotalAmount(order.getTotalPrice());
            dto.setStatus(order.getStatus());
            dto.setTimeAgo("Gần đây"); 
            return dto;
        }).collect(Collectors.toList());

        response.setRecentOrders(orderDTOs);

        return response;
    }
}