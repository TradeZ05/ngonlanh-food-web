// admin/js/order.js
let currentPage = 0;
const pageSize = 10;

async function loadOrders(status = "", page = 0) {
    currentPage = page;
    const url = `/orders?page=${page}&size=${pageSize}${status ? '&status=' + status : ''}`;

    try {
        const data = await apiRequest(url, "GET"); // Gọi API lấy đơn hàng
        renderOrderTable(data.content);
        renderPagination(data.totalPages);
    } catch (error) {
        console.error("Lỗi tải dimage sách đơn hàng:", error);
    }
}

function renderOrderTable(orders) {
    const tableBody = document.getElementById("order-table-body");
    tableBody.innerHTML = orders.map(order => `
        <tr>
            <td>#${order.id}</td>
            <td>${order.customerName}</td>
            <td>${new Date(order.orderDate).toLocaleDateString('vi-VN')}</td>
            <td>${order.totalPrice.toLocaleString()}đ</td>
            <td><span class="badge status-${order.status.toLowerCase()}">${order.status}</span></td>
            <td>
                <select onchange="updateStatus(${order.id}, this.value)" class="form-select-sm">
                    <option value="">Đổi trạng thái</option>
                    <option value="PROCESSING">Duyệt đơn</option>
                    <option value="SHIPPING">Giao hàng</option>
                    <option value="DELIVERED">Hoàn thành</option>
                    <option value="CANCELLED">Hủy đơn</option>
                </select>
            </td>
        </tr>
    `).join('');
}

async function updateStatus(orderId, newStatus) {
    if (!newStatus) return;

    if (confirm(`Xác nhận chuyển đơn hàng #${orderId} sang trạng thái ${newStatus}?`)) {
        try {
            await apiRequest(`/${orderId}/status`, "PUT", { status: newStatus }); // API cập nhật trạng thái
            alert("Cập nhật thành công!");
            loadOrders(); // Tải lại dimage sách
        } catch (error) {
            alert("Lỗi: " + error.message);
        }
    }
}