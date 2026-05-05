// =================== POPUP KHUYẾN MÃI ===================
document.addEventListener('DOMContentLoaded', () => {
    const popup = document.getElementById('promoPopup');
    const closeBtn = document.getElementById('promoClose');

    if (popup && closeBtn) {
        const closePopup = () => popup.classList.add('hidden');

        closeBtn.addEventListener('click', closePopup);

        // Click bên ngoài content cũng đóng được popup
        popup.addEventListener('click', (e) => {
            if (e.target === popup) closePopup();
        });

        // Bấm phím Esc để đóng
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closePopup();
        });
    }

    // =================== TABS THỰC ĐƠN ===================
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('[data-tab-content]');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.dataset.tab;

            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            tabContents.forEach(c => {
                if (c.dataset.tabContent === target) {
                    c.removeAttribute('hidden');
                } else {
                    c.setAttribute('hidden', '');
                }
            });
        });
    });
});

// =================== LOAD SẢN PHẨM TỪ API (giữ nguyên) ===================
const API_URL = "http://localhost:8080/api/products";

async function loadProducts() {
    const productList = document.getElementById('product-list');
    if (!productList) return; // Không có vùng hiển thị thì bỏ qua

    try {
        const response = await fetch(API_URL);
        const products = await response.json();

        productList.innerHTML = '';

        products.forEach(product => {
            const productCard = `
                <div class="card">
                    <img src="${product.imageUrl || 'https://via.placeholder.com/150'}" alt="${product.name}">
                    <h3>${product.name}</h3>
                    <p class="category">${product.category ? product.category.name : 'Chưa phân loại'}</p>
                    <p class="price">${product.price.toLocaleString('vi-VN')} VNĐ</p>
                    <button>Thêm vào giỏ</button>
                </div>
            `;
            productList.innerHTML += productCard;
        });
    } catch (error) {
        console.error("Lỗi khi gọi API:", error);
        productList.innerHTML = "Không thể kết nối với Backend!";
    }
}

loadProducts();
const promoPopup = document.getElementById("promoPopup");
const promoClose = document.getElementById("promoClose");

/* Khi mở trang, nếu popup đang hiện thì khóa cuộn */
if (promoPopup && !promoPopup.classList.contains("hidden")) {
    document.body.classList.add("no-scroll");
}

/* Khi bấm dấu X thì đóng popup và mở cuộn lại */
if (promoClose) {
    promoClose.addEventListener("click", function () {
        promoPopup.classList.add("hidden");
        document.body.classList.remove("no-scroll");
    });
}
const promoButtons = document.querySelectorAll(".btn-promo");

promoButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        window.location.href = "dangnhap.html";
    });
});