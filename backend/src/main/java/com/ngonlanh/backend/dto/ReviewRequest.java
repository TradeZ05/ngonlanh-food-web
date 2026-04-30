package com.ngonlimage.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReviewRequest {
    private Integer productId;
    private int rating; // Số sao từ 1 đến 5
    private String comment;
}