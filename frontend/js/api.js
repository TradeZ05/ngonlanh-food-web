// File: frontend/js/api.js
const API_BASE_URL = "http://localhost:8080/api";

// Hàm gọi API tự động kẹp Token (Dùng cho các chức năng cần đăng nhập)
async function fetchWithToken(endpoint, options = {}) {
    const token = localStorage.getItem('accessToken');
    const headers = { 'Content-Type': 'application/json', ...options.headers };

    // Nếu trong két có Token thì lấy ra kẹp vào Header
    if (token) {
        headers['Authorization'] = `Bearer ${token}`; 
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });

    // Bị lỗi 401 hoặc 403 tức là Token hết hạn hoặc sai lệch -> Bắt đăng nhập lại
    if (response.status === 401 || response.status === 403) {
        alert("Phiên đăng nhập hết hạn hoặc không hợp lệ. Vui lòng đăng nhập lại!");
        localStorage.removeItem('accessToken');
        window.location.href = "dangnhap.html";
    }
    
    return response;
}