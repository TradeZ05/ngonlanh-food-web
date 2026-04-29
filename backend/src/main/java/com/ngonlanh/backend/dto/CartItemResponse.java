package com.ngonlanh.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CartItemResponse {
    private Long cartItemId;     // Để sau này làm chức năng xóa món khỏi giỏ
    private Integer productId;
    private String productName;
    private Double price;
    private String imageUrl;
    private Integer quantity;
    private Double totalItemPrice; // Tổng tiền của riêng món này (price * quantity)
}