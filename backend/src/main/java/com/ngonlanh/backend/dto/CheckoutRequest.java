package com.ngonlimage.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CheckoutRequest {
    private String address;
    private String phoneNumber;
    private String note;
    private String paymentMethod; // VD: "COD" (Thimage toán khi nhận hàng)
}