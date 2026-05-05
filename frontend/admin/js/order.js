// admin/js/order.js
let currentPage = 0;
const pageSize = 10;

// Lắng nghe sự kiện trang vừa load xong là gọi API ngay
document.addEventListener("DOMContentLoaded", () => {
    loadOrders("", 0); 
});

// Hàm lấy danh sách đơn hàng từ API
async function loadOrders(status = "", page = 0) {
    currentPage = page;
    const url = `/orders?page=${page}&size=${pageSize}${status ? '&status=' + status : ''}`;

    try {
        // DÙNG HÀM fetchWithToken CHUẨN CỦA TEAM NÍ
        const response = await fetchWithToken(url, { method: "GET" }); 
        
        // Kiểm tra lỗi (vì fetchWithToken trả về raw response)
        if (!response.ok) throw new Error("Lỗi từ Backend: " + response.status);
        
        // Ép kiểu dữ liệu về JSON
        const data = await response.json();
        
        renderOrderTable(data.content);
        
        if (typeof renderPagination === "function" && data.totalPages !== undefined) {
            renderPagination(data.totalPages);
        }
    } catch (error) {
        console.error("Lỗi tải danh sách đơn hàng:", error);
        document.getElementById("order-table-body").innerHTML = 
            '<tr><td colspan="7" style="text-align:center; color:red;">Lỗi tải dữ liệu. Hãy kiểm tra Backend.</td></tr>';
    }
}

// Hàm in dữ liệu ra HTML
function renderOrderTable(orders) {
    const tableBody = document.getElementById("order-table-body");
    
    if (!orders || orders.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="7" style="text-align:center;">Chưa có đơn hàng nào.</td></tr>';
        return;
    }

    tableBody.innerHTML = orders.map(order => {
        const formattedDate = new Date(order.orderDate).toLocaleDateString('vi-VN');
        const formattedPrice = order.totalPrice.toLocaleString('vi-VN') + ' đ';
        const totalItems = order.totalItems ? order.totalItems : 1;
        const cusName = order.customerName ? order.customerName : 'Khách vãng lai';

        return `
            <tr>
                <td style="font-weight: bold;">#ORD-00${order.id}</td>
                <td>${cusName}</td>
                <td>${formattedDate}</td>
                <td style="text-align: center;">${totalItems}</td>
                <td style="font-weight: bold; color: #b35938;">${formattedPrice}</td>
                <td>
                    <span class="badge status-${order.status.toLowerCase()}">${order.status}</span>
                </td>
                <td>
                    <select onchange="updateStatus(${order.id}, this.value)" class="form-select-sm" style="padding: 3px; border-radius: 4px;">
                        <option value="">Đổi trạng thái...</option>
                        <option value="PROCESSING">Duyệt đơn</option>
                        <option value="SHIPPING">Giao hàng</option>
                        <option value="DELIVERED">Hoàn thành</option>
                        <option value="CANCELLED">Hủy đơn</option>
                    </select>
                </td>
            </tr>
        `;
    }).join('');
}

// Hàm cập nhật trạng thái đơn hàng
async function updateStatus(orderId, newStatus) {
    if (!newStatus) return;

    if (confirm(`Xác nhận chuyển đơn hàng #ORD-00${orderId} sang trạng thái ${newStatus}?`)) {
        try {
            // DÙNG HÀM fetchWithToken BẮN LÊN BE
            const response = await fetchWithToken(`/orders/${orderId}/status`, {
                method: "PUT",
                body: JSON.stringify({ status: newStatus }) // Gói data vào body gửi đi
            }); 
            
            if (!response.ok) throw new Error("Lỗi cập nhật trên server!");

            alert("Cập nhật trạng thái thành công!");
            loadOrders("", currentPage); // Load lại bảng
        } catch (error) {
            alert("Lỗi cập nhật: " + error.message);
        }
    }
}