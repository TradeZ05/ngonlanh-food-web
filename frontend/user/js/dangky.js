document.addEventListener('DOMContentLoaded', () => {
    const formDangKy = document.getElementById('form-dang-ky');

    if (formDangKy) {
        formDangKy.addEventListener('submit', async (e) => {
            e.preventDefault();

            const username = document.getElementById('reg-username').value.trim();
            const email = document.getElementById('reg-email').value.trim();
            const password = document.getElementById('reg-password').value;
            const confirmPassword = document.getElementById('reg-confirm-password').value;

            if (password !== confirmPassword) {
                alert("Mật khẩu nhập lại không khớp!");
                return;
            }

            const userData = {
                username: username,
                email: email,
                password: password
            };

            try {
                const response = await fetch(`${API_BASE_URL}/auth/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(userData)
                });

                if (response.ok) {
                    // CẤT "USERNAME" VÀO TỦ (chứ không cất email nữa)
                    localStorage.setItem('registeredUsername', username);

                    alert("Đăng ký thành công! Đang chuyển đến trang xác thực OTP.");
                    window.location.href = "xacthuc.html"; 
                } else {
                    const errorMsg = await response.text();
                    alert("Đăng ký thất bại: " + errorMsg);
                }
            } catch (error) {
                console.error("Lỗi:", error);
                alert("Không kết nối được Server. Ní bật Spring Boot chưa?");
            }
        });
    }
});