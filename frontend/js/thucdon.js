document.addEventListener('DOMContentLoaded', () => {
    loadMonChay();
});

async function loadMonChay() {
    try {
        const response = await fetch(`${API_BASE_URL}/products`); 
        
        if (response.ok) {
            const products = await response.json();
            
            // Xóa các món ăn tĩnh ban đầu (chỉ xóa <article>, giữ lại Banner)
            const allMenuGrids = document.querySelectorAll('.menu-grid');
            allMenuGrids.forEach(grid => {
                const oldCards = grid.querySelectorAll('article.food-card');
                oldCards.forEach(card => card.remove());
            });

            // Duyệt qua từng sản phẩm từ Database
            products.forEach(sp => {
                const giaTien = sp.price ? sp.price.toLocaleString('vi-VN') : '0';
                
                // Khung HTML của 1 món ăn
                const html = `
                    <article class="food-card" onclick="themVaoGio(${sp.id})" style="cursor: pointer; transition: 0.3s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                        <img src="${sp.imageUrl || './anh/2.png'}" alt="${sp.name}">
                        <h3>${sp.name}</h3>
                        <p>${sp.description || 'Món chay thanh đạm'}</p>
                        <div class="bottom">
                            <span>⭐ 5.0</span>
                            <b>${giaTien} đ</b>
                        </div>
                    </article>
                `;

                // Logic tìm "Đúng mâm" cho món ăn
                let containerId = "";
                const maDanhMuc = sp.category?.id; 
                
                // 🚨 NÍ CHÚ Ý: Sửa các số 1, 2, 3... dưới đây cho khớp với ID Danh mục trong MySQL của ní nhé
                if (maDanhMuc === 1) containerId = 'menu-khai-vi';
                else if (maDanhMuc === 2) containerId = 'menu-tron';
                else if (maDanhMuc === 3) containerId = 'menu-dau-hu';
                else if (maDanhMuc === 4) containerId = 'menu-nam';
                else if (maDanhMuc === 5) containerId = 'menu-rau-cu';
                else if (maDanhMuc === 6) containerId = 'menu-mon-chinh';
                else if (maDanhMuc === 7) containerId = 'menu-bun-mi';
                else if (maDanhMuc === 8) containerId = 'menu-canh'; // Món canh mới bổ sung
                else if (maDanhMuc === 9) containerId = 'menu-lau';

                // Nếu tìm thấy đúng ID, nhét món ăn vào DƯỚI cái Banner
                if (containerId) {
                    const targetContainer = document.getElementById(containerId);
                    if (targetContainer) {
                        targetContainer.innerHTML += html;
                    }
                }
            });
        }
    } catch (error) {
        console.error("Lỗi lấy dữ liệu:", error);
    }
}

function themVaoGio(idSanPham) {
    alert("Đã thêm món số " + idSanPham + " vào giỏ hàng!");
}