document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. KIỂM TRA ĐĂNG NHẬP (Soft Check)
    // ==========================================
    const loginBtn = document.getElementById('btn-login-logout');
    const token = localStorage.getItem('accessToken');

    if (token) {
        loginBtn.innerText = 'Đăng xuất';
        loginBtn.style.backgroundColor = '#d9534f'; 
        loginBtn.style.color = '#fff';
        
        loginBtn.onclick = (e) => {
            e.preventDefault();
            if (confirm("Ní có chắc muốn đăng xuất không?")) {
                localStorage.removeItem('accessToken'); 
                window.location.reload(); 
            }
        };
    } else {
        loginBtn.onclick = () => {
            window.location.href = 'dangnhap.html';
        }
    }

    // ==========================================
    // 2. XỬ LÝ GỬI FORM LIÊN HỆ
    // ==========================================
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Chặn việc trang bị reload khi bấm submit

            // Lấy dữ liệu từ form
            const name = document.getElementById('contact-name').value;
            const email = document.getElementById('contact-email').value;
            const message = document.getElementById('contact-message').value;

            // Chỗ này sau này có API thì ní dùng fetch() để POST data lên Spring Boot nhé
            // Ví dụ: await fetch('http://localhost:8080/api/contact', { ... })

            // Giả lập gửi thành công
            alert(`✅ Cảm ơn ${name}! Yêu cầu của bạn đã được gửi đến hệ thống Ngon Lành. Chúng tôi sẽ phản hồi qua email ${email} sớm nhất có thể!`);
            
            // Xóa trắng form sau khi gửi
            contactForm.reset();
        });
    }
});