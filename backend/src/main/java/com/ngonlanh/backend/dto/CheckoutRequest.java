package com.ngonlanh.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CheckoutRequest {
    private String address;
    private String phoneNumber;
    private String note;
    private String paymentMethod; // VD: "COD" (Thanh toán khi nhận hàng)
}