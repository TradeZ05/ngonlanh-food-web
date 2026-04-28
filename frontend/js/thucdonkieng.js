document.addEventListener('DOMContentLoaded', async () => {
    const menuContainer = document.getElementById('diet-menu-container');
    const API_URL = "http://localhost:8080/api/products/diet"; // Đường dẫn API của ní

    try {
        const response = await fetch(API_URL);
        const products = await response.json(); // Nhận mảng JSON từ Spring Boot

        // Xóa các món cũ (nếu có) trừ cái Banner đầu tiên ra
        const banner = menuContainer.querySelector('.banner-featured');
        menuContainer.innerHTML = '';
        menuContainer.appendChild(banner);

        // Duyệt qua từng món ăn và vẽ thẻ HTML
        products.forEach(item => {
            const card = document.createElement('article');
            card.className = 'food-card';
            card.style.cursor = 'pointer';

            card.innerHTML = `
                <img src="./anh/${item.image}" alt="${item.name}">
                <h3>${item.name}</h3>
                <p>${item.description}</p>
                <div class="bottom">
                    <span>⭐ ${item.rating || '5.0'}</span>
                    <b>${new Intl.NumberFormat('vi-VN').format(item.price)}đ</b>
                </div>
            `;

            // Gắn sự kiện click chọn món
            card.addEventListener('click', () => {
                alert(`🛒 Thêm [${item.name}] vào giỏ hàng thành công!`);
            });

            menuContainer.appendChild(card);
        });

    } catch (error) {
        console.error("Không lấy được dữ liệu:", error);
        // Nếu lỗi (chưa bật Server), ní có thể hiện thông báo cho khách
    }
});