package com.ngonlanh.backend.repository;

import com.ngonlanh.backend.entity.Product;
import com.ngonlanh.backend.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    // Hàm lấy toàn bộ review của một món ăn cụ thể
    List<Review> findByProduct(Product product);
}