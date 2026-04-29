document.addEventListener('DOMContentLoaded', async () => {
    
    // ==========================================
    // 1. KIỂM TRA ĐĂNG NHẬP (Hard Check - Bắt buộc)
    // ==========================================
    const token = localStorage.getItem('accessToken');

    if (!token) {
        // Chưa đăng nhập mà dám mò vào đây -> Đá về trang Đăng nhập ngay!
        alert("⚠️ Ní ơi, phải đăng nhập mới xem được hồ sơ cá nhân nha!");
        window.location.href = 'dangnhap.html';
        return; // Dừng luôn toàn bộ code phía dưới
    }

    // Xử lý nút Đăng xuất trên Header
    const loginBtn = document.getElementById('btn-login-logout');
    if (loginBtn) {
        loginBtn.innerText = 'Đăng xuất';
        loginBtn.style.backgroundColor = '#d9534f'; 
        loginBtn.style.color = '#fff';
        
        loginBtn.onclick = (e) => {
            e.preventDefault();
            if (confirm("Ní có chắc muốn đăng xuất không?")) {
                localStorage.removeItem('accessToken'); 
                window.location.href = 'trangchu.html'; // Đăng xuất xong đá về trang chủ
            }
        };
    }

    // Xử lý nút Đăng xuất dưới Sidebar
    const sidebarLogoutBtn = document.getElementById('btn-sidebar-logout');
    if (sidebarLogoutBtn) {
        sidebarLogoutBtn.onclick = (e) => {
            e.preventDefault();
            if (confirm("Ní có chắc muốn đăng xuất không?")) {
                localStorage.removeItem('accessToken'); 
                window.location.href = 'trangchu.html';
            }
        };
    }

    // ==========================================
    // 2. RENDER DỮ LIỆU USER (Gọi API)
    // ==========================================
    // const API_URL = "http://localhost:8080/api/user/profile"; 

    try {
        // Mở comment đoạn này nếu Spring Boot đã viết xong API lấy User
        /* const response = await fetch(API_URL, {
            headers: {
                'Authorization': `Bearer ${token}` // Gửi chìa khóa cho Backend xác thực
            }
        });
        const userData = await response.json(); 
        */

        // Dữ liệu giả lập (Mock data) trả về từ Backend
        const userData = {
            fullName: "Nguyễn Văn A",
            phone: "0908 882 795",
            email: "abc@gmail.com",
            address: "Quận 12, TP.HCM",
            dob: "27/03/2001",
            gender: "Nam"
        };

        // Đổ dữ liệu vào giao diện
        document.getElementById('profile-name').innerText = userData.fullName;
        document.getElementById('profile-phone').innerText = userData.phone;
        document.getElementById('profile-email').innerText = userData.email;
        document.getElementById('profile-address').innerText = userData.address;
        document.getElementById('profile-dob').innerText = userData.dob;
        document.getElementById('profile-gender').innerText = userData.gender;

    } catch (error) {
        console.error("Lỗi khi lấy thông tin tài khoản:", error);
        alert("Không thể tải thông tin. Vui lòng thử lại sau!");
    }
});