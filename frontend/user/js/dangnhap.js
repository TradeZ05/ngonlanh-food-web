// File: frontend/js/dangnhap.js
document.addEventListener('DOMContentLoaded', () => {
    const btnLogin = document.getElementById('btnLogin');
    
    if (btnLogin) {
        btnLogin.addEventListener('click', async (e) => {
            e.preventDefault(); // Ngăn trình duyệt tự tải lại trang
            
            const user = document.getElementById('username').value;
            const pass = document.getElementById('password').value;

            try {
                // Đăng nhập thì chưa có Token, nên gọi fetch bình thường
                const response = await fetch(`${API_BASE_URL}/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username: user, password: pass })
                });

                if (response.ok) {
                    const data = await response.json();
                    
                    // Cất Token vào LocalStorage
                    localStorage.setItem('accessToken', data.accessToken); 
                    alert("Đăng nhập thành công!");
                    
                    // Chuyển hướng sang trang thực đơn chay
                    window.location.href = "thucdonchay.html"; 
                } else {
                    alert("Tài khoản hoặc mật khẩu không đúng!");
                }
            } catch (error) {
                console.error("Lỗi Server:", error);
                alert("Không kết nối được Server. Ní bật Spring Boot chưa?");
            }
        });
    }
});