document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. XỬ LÝ NÚT ĐĂNG NHẬP / ĐĂNG XUẤT ---
    const loginBtn = document.getElementById('btn-login-logout');
    const token = localStorage.getItem('accessToken');

    if (token) {
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
    }

    // --- 2. BẮT SỰ KIỆN CLICK ĐỒ UỐNG (.food-card) ---
    const drinkCards = document.querySelectorAll('.drink-wrapper .food-card');
    
    drinkCards.forEach(card => {
        card.style.cursor = 'pointer';
        card.addEventListener('mouseenter', () => card.style.transform = 'scale(1.02)');
        card.addEventListener('mouseleave', () => card.style.transform = 'scale(1)');

        card.addEventListener('click', () => {
            const itemName = card.querySelector('h3').innerText;
            const itemPrice = card.querySelector('b').innerText;

            if (token) {
                alert(`🥤 Đã ném [${itemName} - ${itemPrice}] vào giỏ hàng!`);
            } else {
                alert(`⚠️ Thèm [${itemName}] quá đi! Đăng nhập để chốt đơn ngay ní ơi!`);
            }
        });
    });

    // --- 3. BẮT SỰ KIỆN CLICK TRÁNG MIỆNG (dựa vào thẻ <a> class="view-more") ---
    const dessertButtons = document.querySelectorAll('.dessert-section .view-more');
    
    dessertButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault(); // Chặn việc cuộn lên đầu trang do thẻ a href="#"
            
            // Tìm ngược lên thẻ cha để lấy tên và giá
            const cardInfo = e.target.closest('.product-info');
            const itemName = cardInfo.querySelector('.p-name').innerText;
            const itemPrice = cardInfo.querySelector('.p-price').innerText;

            if (token) {
                alert(`🍮 Đã tậu [${itemName} - ${itemPrice}]! Giỏ đồ ngọt đang vẫy gọi!`);
            } else {
                alert(`⚠️ Phải đăng nhập mới được ăn ngọt nha ní!`);
            }
        });
    });
});