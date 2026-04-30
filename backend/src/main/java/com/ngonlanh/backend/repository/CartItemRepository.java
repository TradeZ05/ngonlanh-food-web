package com.ngonlanh.backend.repository;

import com.ngonlanh.backend.entity.Cart;
import com.ngonlanh.backend.entity.CartItem;
import com.ngonlanh.backend.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    // Đã đổi từ User sang Cart để khớp với entity
    Optional<CartItem> findByCartAndProduct(Cart cart, Product product);
}