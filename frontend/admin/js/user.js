// admin/js/user.js
async function loadCustomers(page = 0) {
    try {
        const data = await apiRequest(`/users?page=${page}&size=10`, "GET"); // Gọi API khách hàng
        const tableBody = document.getElementById("customer-table-body");

        tableBody.innerHTML = data.content.map(user => `
            <tr>
                <td>${user.id}</td>
                <td>${user.username}</td>
                <td>${user.email}</td>
                <td>
                    <span class="status-dot ${user.isActive ? 'active' : 'blocked'}"></span>
                    ${user.isActive ? 'Đang hoạt động' : 'Đã bị khóa'}
                </td>
                <td>
                    <button onclick="toggleUser(${user.id})" class="btn-action">
                        ${user.isActive ? 'Khóa tài khoản' : 'Mở khóa'}
                    </button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error("Lỗi tải dimage sách khách hàng:", error);
    }
}

async function toggleUser(userId) {
    try {
        const message = await apiRequest(`/users/${userId}/toggle-status`, "PUT"); // API khóa/mở khóa
        alert(message);
        loadCustomers(); // Cập nhật lại giao diện
    } catch (error) {
        alert("Thao tác thất bại: " + error.message);
    }
}