package com.ngonlanh.backend.repository;

import com.ngonlanh.backend.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    // 1. Tính tổng doanh thu của những đơn hàng đã giao thành công (DELIVERED)
    @Query("SELECT SUM(o.totalAmount) FROM Order o WHERE o.status = 'DELIVERED'")
    Double calculateTotalRevenue();

    // 2. Đếm tổng số đơn hàng đang chờ xử lý (PENDING) để Admin biết mà duyệt
    @Query("SELECT COUNT(o) FROM Order o WHERE o.status = 'PENDING'")
    Long countPendingOrders();

    // 3. Tính tổng doanh thu theo một tháng và năm cụ thể (Dùng Native SQL cho dễ xử lý ngày tháng)
    @Query(value = "SELECT SUM(total_amount) FROM orders WHERE status = 'DELIVERED' AND MONTH(order_date) = :month AND YEAR(order_date) = :year", nativeQuery = true)
    Double calculateRevenueByMonth(int month, int year);
}