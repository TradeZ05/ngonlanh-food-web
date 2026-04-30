// frontend/admin/js/settings.js

document.addEventListener("DOMContentLoaded", () => {
    // Tải thông tin Admin hiện tại (Nếu cần hiển thị sẵn)
    loadAdminProfile();

    // Xử lý đổi mật khẩu
    const pwdForm = document.getElementById("password-form");
    if (pwdForm) {
        pwdForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const newPwd = document.getElementById("new-password").value;
            const confirmPwd = document.getElementById("confirm-password").value;

            if (newPwd !== confirmPwd) {
                alert("Mật khẩu mới và xác nhận không khớp!");
                return;
            }

            try {
                // Giả định bạn có endpoint đổi mật khẩu tại Backend
                await apiRequest("/change-password", "POST", {
                    oldPassword: document.getElementById("current-password").value,
                    newPassword: newPwd
                });
                alert("Đổi mật khẩu thành công!");
                pwdForm.reset();
            } catch (error) {
                alert("Lỗi: " + error.message);
            }
        });
    }
});

async function loadAdminProfile() {
    // Logic để hiển thị email hoặc tên admin từ localStorage hoặc API
    const adminEmail = localStorage.getItem("admin_email");
    if(adminEmail) {
        document.getElementById("admin-email").value = adminEmail;
    }
}