package com.ngonlimage.backend.controller;

import com.ngonlimage.backend.dto.AddToCartRequest;
import com.ngonlimage.backend.entity.Cart;
import com.ngonlimage.backend.entity.CartItem;
import com.ngonlimage.backend.entity.Product;
import com.ngonlimage.backend.entity.User;
import com.ngonlimage.backend.repository.CartRepository;
import com.ngonlimage.backend.repository.CartItemRepository;
import com.ngonlimage.backend.repository.ProductRepository;
import com.ngonlimage.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartItemRepository cartItemRepository;
    @Autowired
    private CartRepository cartRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ProductRepository productRepository;

    @PostMapping("/add")
    public ResponseEntity<?> addToCart(@RequestBody AddToCartRequest request) {
        // 1. Lấy thông tin User hiện tại từ Token
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userRepository.findByUsername(auth.getName())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy User"));

        // 2. Kiểm tra món ăn (Lưu ý: Nếu request.getProductId() báo lỗi đỏ, hãy sửa type nó trong DTO thành Integer nhé)
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy món ăn"));

        // 3. Tìm Cart (Giỏ hàng) của User. Nếu người mới chưa có giỏ thì tạo giỏ mới luôn.
        Cart cart = cartRepository.findByUser(user).orElseGet(() -> {
            Cart newCart = new Cart();
            newCart.setUser(user);
            return cartRepository.save(newCart);
        });

        // 4. Tìm món trong giỏ, chưa có thì tạo mới, có rồi thì cộng dồn
        CartItem cartItem = cartItemRepository.findByCartAndProduct(cart, product)
                .orElse(new CartItem());

        if (cartItem.getId() == null) {
            cartItem.setCart(cart); // Liên kết với Giỏ hàng thay vì User
            cartItem.setProduct(product);
            cartItem.setQuantity(request.getQuantity());
        } else {
            cartItem.setQuantity(cartItem.getQuantity() + request.getQuantity());
        }

        cartItemRepository.save(cartItem);
        return ResponseEntity.ok("Đã thêm " + request.getQuantity() + " phần " + product.getName() + " vào giỏ hàng!");
    }

    @GetMapping("/")
    public ResponseEntity<?> getCart() {
        // 1. Lấy User từ Token
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userRepository.findByUsername(auth.getName())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy User"));

        // 2. Tìm Giỏ hàng của User này
        Cart cart = cartRepository.findByUser(user).orElse(null);
        
        // Nếu chưa có giỏ hoặc giỏ trống thì trả về mảng rỗng
        if (cart == null || cart.getCartItems().isEmpty()) {
            return ResponseEntity.ok(java.util.Collections.emptyList());
        }

        // 3. Đóng gói dữ liệu sang DTO để trả về cho Frontend
        java.util.List<com.ngonlimage.backend.dto.CartItemResponse> responses = cart.getCartItems().stream().map(item -> {
            com.ngonlimage.backend.dto.CartItemResponse dto = new com.ngonlimage.backend.dto.CartItemResponse();
            dto.setCartItemId(item.getId());
            dto.setProductId(item.getProduct().getId().intValue()); // Ép kiểu cẩn thận
            dto.setProductName(item.getProduct().getName());
            dto.setPrice(item.getProduct().getPrice());
            dto.setImageUrl(item.getProduct().getImageUrl());
            dto.setQuantity(item.getQuantity());
            dto.setTotalItemPrice(item.getProduct().getPrice() * item.getQuantity());
            return dto;
        }).collect(java.util.stream.Collectors.toList());

        return ResponseEntity.ok(responses);
    }
}