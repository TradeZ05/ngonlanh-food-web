package com.ngonlanh.backend.service;

import com.ngonlanh.backend.dto.ReviewRequest;
import com.ngonlanh.backend.entity.Product;
import com.ngonlanh.backend.entity.Review;
import com.ngonlanh.backend.entity.User;
import com.ngonlanh.backend.repository.OrderRepository;
import com.ngonlanh.backend.repository.ProductRepository;
import com.ngonlanh.backend.repository.ReviewRepository;
import com.ngonlanh.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReviewService {

    @Autowired private ReviewRepository reviewRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private ProductRepository productRepository;
    @Autowired private OrderRepository orderRepository;

    // 1. Trả về dimage sách review của 1 món ăn
    public List<Review> getReviewsByProduct(Integer productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy món ăn"));
        return reviewRepository.findByProduct(product); 
        // (Nếu IDE báo lỗi dòng trên, bro vào ReviewRepository tạo hàm findByProduct(Product p) là xong)
    }

    // 2. Thêm review mới (Có check điều kiện)
    public Review addReview(String username, ReviewRequest request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy User"));

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy món ăn"));

        // LOGIC CHẶT CHẼ: Phải mua rồi mới được đánh giá
        boolean hasBought = orderRepository.hasUserOrderedProduct(user, product);
        if (!hasBought) {
            throw new RuntimeException("Bạn phải trải nghiệm món ăn này trước khi đánh giá!");
        }

        // Khởi tạo và lưu Review
        Review review = new Review();
        review.setUser(user);
        review.setProduct(product);
        review.setRating(request.getRating());
        review.setComment(request.getComment());

        return reviewRepository.save(review);
    }
}