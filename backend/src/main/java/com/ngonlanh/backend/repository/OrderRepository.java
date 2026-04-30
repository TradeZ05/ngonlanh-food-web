package com.ngonlanh.backend.repository;

import com.ngonlanh.backend.entity.Order;
import com.ngonlanh.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import com.ngonlanh.backend.entity.Product;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    // 1. Tính tổng doimage thu của những đơn hàng đã giao thành công (DELIVERED)
   @Query("SELECT SUM(o.totalPrice) FROM Order o WHERE o.status = 'DELIVERED'")
    Double calculateTotalRevenue();

    // 2. Đếm tổng số đơn hàng đang chờ xử lý (PENDING) để Admin biết mà duyệt
    @Query("SELECT COUNT(o) FROM Order o WHERE o.status = 'PENDING'")
    Long countPendingOrders();

    // 3. Tính tổng doimage thu theo một tháng và năm cụ thể (Dùng Native SQL cho dễ xử lý ngày tháng)
    @Query(value = "SELECT SUM(total_amount) FROM orders WHERE status = 'DELIVERED' AND MONTH(order_date) = :month AND YEAR(order_date) = :year", nativeQuery = true)
    Double calculateRevenueByMonth(int month, int year);

    List<Order> findByUserOrderByIdDesc(User user);

    @Query("SELECT CASE WHEN COUNT(o) > 0 THEN true ELSE false END FROM Order o JOIN o.orderDetails od WHERE o.user = :user AND od.product = :product")
    boolean hasUserOrderedProduct(@Param("user") User user, @Param("product") Product product);

    // 1. Đếm số đơn hàng theo trạng thái (VD: đếm đơn PENDING)
    Long countByStatus(String status);

    // 2. Tính tổng doimage thu trong 1 khoảng thời gian (Chỉ tính đơn đã thimage toán/hoàn thành)
    @Query("SELECT SUM(o.totalPrice) FROM Order o WHERE o.status IN :statuses AND o.orderDate >= :startDate AND o.orderDate <= :endDate")
    Double calculateRevenue(@Param("statuses") java.util.List<String> statuses, 
                            @Param("startDate") java.time.LocalDateTime startDate, 
                            @Param("endDate") java.time.LocalDateTime endDate);

    // Sửa CreatedAt thành OrderDate (Nhớ viết hoa chữ O và D)
    java.util.List<Order> findTop5ByOrderByOrderDateDesc();

    List<Order> findByStatusOrderByOrderDateDesc(String status);
    List<Order> findAllByOrderByOrderDateDesc();
}