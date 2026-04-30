package com.ngonlimage.backend.service;

import com.ngonlimage.backend.dto.CheckoutRequest;
import com.ngonlimage.backend.entity.*;
import com.ngonlimage.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class OrderService {

    @Autowired private UserRepository userRepository;
    @Autowired private CartRepository cartRepository;
    @Autowired private CartItemRepository cartItemRepository;
    @Autowired private OrderRepository orderRepository;

    @Transactional // Bùa hộ mệnh: Có lỗi là Rollback toàn bộ
    public Order placeOrder(String username, CheckoutRequest request) {
        // 1. Tìm User đang đăng nhập
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy User"));

        // 2. Lấy Giỏ hàng của User
        Cart cart = cartRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Giỏ hàng trống!"));
                
        if (cart.getCartItems().isEmpty()) {
            throw new RuntimeException("Không có món ăn nào trong giỏ để thimage toán!");
        }

        // 3. Khởi tạo Đơn hàng (Order)
        Order order = new Order();
        order.setUser(user);
        order.setShippingAddress(request.getAddress());
        order.setReceiverPhone(request.getPhoneNumber());
        order.setNote(request.getNote());
        order.setStatus("PENDING"); // Trạng thái: Chờ xác nhận
        order.setPaymentMethod(request.getPaymentMethod() != null ? request.getPaymentMethod() : "COD");

        // 4. Chuyển món ăn từ Giỏ sang Chi tiết đơn hàng và tính Tổng tiền
        double total = 0;
        List<OrderDetail> orderDetails = new ArrayList<>();
        
        for (CartItem item : cart.getCartItems()) {
            OrderDetail detail = new OrderDetail();
            detail.setOrder(order);
            detail.setProduct(item.getProduct());
            detail.setQuantity(item.getQuantity());
            detail.setPrice(item.getProduct().getPrice()); // Chốt giá tại thời điểm mua
            
            orderDetails.add(detail);
            total += (item.getProduct().getPrice() * item.getQuantity());
        }
        
        order.setOrderDetails(orderDetails);
        order.setTotalPrice(total);

        // 5. Lưu đơn hàng vào Database
        Order savedOrder = orderRepository.save(order);

        // 6. Dọn dẹp: Xóa sạch đồ trong giỏ hàng
        cartItemRepository.deleteAll(cart.getCartItems());
        cart.getCartItems().clear();
        cartRepository.save(cart);

        return savedOrder; // Trả về đơn hàng thành công
    }

    // Hàm lấy lịch sử mua hàng
    public List<Order> getOrderHistory(String username) {
        // Tìm User đang đăng nhập
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy User"));
        
        // Trả về dimage sách đơn hàng
        return orderRepository.findByUserOrderByIdDesc(user);
    }

    // Hàm cập nhật trạng thái đơn hàng
    public Order updateOrderStatus(Long orderId, String status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng id: " + orderId));
        
        // Cập nhật trạng thái mới (VD: DELIVERED, CANCELLED...)
        order.setStatus(status);
        
        return orderRepository.save(order);
    }
}