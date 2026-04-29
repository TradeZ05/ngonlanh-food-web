package com.ngonlanh.backend.controller;

import com.ngonlanh.backend.dto.ReviewRequest;
import com.ngonlanh.backend.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    // API 1: Ai cũng xem được review của món ăn (không cần đăng nhập)
    @GetMapping("/product/{productId}")
    public ResponseEntity<?> getProductReviews(@PathVariable Integer productId) {
        try {
            return ResponseEntity.ok(reviewService.getReviewsByProduct(productId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // API 2: Gửi review mới (Bắt buộc có Token)
    @PostMapping("/add")
    public ResponseEntity<?> addReview(@RequestBody ReviewRequest request) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String username = auth.getName();

            reviewService.addReview(username, request);
            return ResponseEntity.ok("Cảm ơn bạn đã đánh giá món ăn!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi: " + e.getMessage());
        }
    }
}