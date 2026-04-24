document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. KIỂM TRA ĐĂNG NHẬP (Soft Check)
    // ==========================================
    const loginBtn = document.getElementById('btn-login-logout');
    const token = localStorage.getItem('accessToken');

    if (token) {
        // Đổi trạng thái thành Đăng xuất nếu có Token
        loginBtn.innerText = 'Đăng xuất';
        loginBtn.style.backgroundColor = '#d9534f'; 
        loginBtn.style.color = '#fff';
        
        loginBtn.onclick = (e) => {
            e.preventDefault();
            const confirmLogout = confirm("Ní có chắc muốn đăng xuất không?");
            if (confirmLogout) {
                localStorage.removeItem('accessToken'); 
                window.location.reload(); 
            }
        };
    } else {
        // Chuyển hướng nếu chưa đăng nhập
        loginBtn.onclick = () => {
            window.location.href = 'dangnhap.html';
        }
    }

    // ==========================================
    // 2. TẮT MỞ POPUP ƯU ĐÃI
    // ==========================================
    const popup = document.getElementById('popup');
    const closeBtn = document.getElementById('btn-close-popup');

    if (popup && closeBtn) {
        closeBtn.onclick = () => {
            // Hiệu ứng mờ dần cho xịn
            popup.style.opacity = '0';
            setTimeout(() => {
                popup.style.display = 'none';
            }, 300); // Đợi 0.3s cho mờ hẳn rồi mới tắt
        };
    }
});