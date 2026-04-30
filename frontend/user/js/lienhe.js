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
    // 2. XỬ LÝ GỬI FORM LIÊN HỆ & SHOW MODAL
    // ==========================================
    const btnSubmit = document.querySelector('.btn-submit');
    const contactForm = document.querySelector('.contact-form');
    const successModal = document.getElementById('successModal');
    
    if (btnSubmit && successModal) {
        btnSubmit.addEventListener('click', async (e) => {
            e.preventDefault();

            // Nếu muốn validate form thì check ở đây (ví dụ kiểm tra rỗng)
            const inputs = contactForm.querySelectorAll('input');
            let isValid = true;
            inputs.forEach(input => {
                if(input.value.trim() === '') isValid = false;
            });

            if (!isValid) {
                alert("Vui lòng nhập đầy đủ thông tin!");
                return;
            }

            // Hiển thị modal thành công
            successModal.classList.add('show');
            
            // Xóa trắng form sau khi gửi
            contactForm.reset();
        });
    }
});