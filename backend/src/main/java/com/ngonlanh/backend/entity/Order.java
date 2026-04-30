package com.ngonlanh.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders")
@Getter
@Setter
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    // --- THÔNG TIN GIAO HÀNG (Lưu cứng vào đơn) ---
    @Column(name = "receiver_name")
    private String receiverName;

    @Column(name = "receiver_phone")
    private String receiverPhone;

    @Column(name = "shipping_address", columnDefinition = "TEXT")
    private String shippingAddress;

    @Column(name = "note", columnDefinition = "TEXT")
    private String note;

    // --- THÔNG TIN THimage TOÁN & TRẠNG THÁI ---
    @Column(name = "payment_method")
    private String paymentMethod;

    // Dùng totalPrice (Đã fix để khớp với OrderRepository)
    @Column(name = "total_price")
    private Double totalPrice; 

    // Trạng thái đơn: PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED
    @Column(name = "status")
    private String status = "PENDING"; 

    // Dùng orderDate (Đã fix để khớp với OrderRepository)
    @Column(name = "order_date")
    private LocalDateTime orderDate = LocalDateTime.now();

    // --- CHI TIẾT ĐƠN HÀNG ---
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    private List<OrderDetail> orderDetails = new ArrayList<>();
}