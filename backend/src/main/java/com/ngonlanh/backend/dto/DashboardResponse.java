package com.ngonlanh.backend.dto;

import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Getter
@Setter
public class DashboardResponse {
    private Double todayRevenue;
    private Long newOrdersCount;
    private Double monthlyRevenue;
    private Long totalProducts;

    private List<Double> revenueLast7Days; 
    private List<String> labelsLast7Days; 

    private List<OrderSummaryDTO> recentOrders;

    @Getter
    @Setter
    public static class OrderSummaryDTO {
        private String orderCode;
        private String customerName;
        private String itemsSummary;
        private Double totalAmount;
        private String status;
        private String timeAgo;
    }
}