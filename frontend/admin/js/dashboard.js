document.addEventListener("DOMContentLoaded", function () {
    loadDashboardStats();
});

async function loadDashboardStats() {
    try {
        const token = localStorage.getItem("token"); 
        const headers = {
            "Content-Type": "application/json",
        };
        if (token) {
            headers["Authorization"] = "Bearer " + token;
        }

        const response = await fetch("http://localhost:8080/api/dashboard/stats", {
            method: "GET",
            headers: headers
        });

        if (!response.ok) {
            throw new Error("Không thể kết nối đến Backend!");
        }

        // Khai báo biến 'data' MỘT LẦN DUY NHẤT ở đây thôi ní nha
        const data = await response.json();
        
        const formatter = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' });

        document.getElementById("total-revenue").innerText = formatter.format(data.monthlyRevenue || 0);
        document.getElementById("pending-count").innerText = data.newOrdersCount || 0;
        // Thay vì data.totalProducts, giờ mình lấy đúng tổng đơn
        document.getElementById("total-orders").innerText = data.totalOrders || 0; 
        // Thay vì số 0 cứng nhắc, mình lấy tổng khách
        document.getElementById("total-customers").innerText = data.totalCustomers || 0;

    } catch (error) {
        console.error("Lỗi tải thống kê:", error);
        document.getElementById("total-revenue").innerText = "Lỗi tải dữ liệu";
    }
}