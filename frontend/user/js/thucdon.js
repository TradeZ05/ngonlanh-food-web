document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();
});

async function fetchProducts() {
    const API_URL = 'https://jnkrr5jc-8080.asse.devtunnels.ms/api/products'; 
    const menuContainer = document.getElementById('menu-container');

    if (!menuContainer) {
        console.error('Lỗi: Không tìm thấy <div id="menu-container"> trong HTML!');
        return;
    }

    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const products = await response.json(); 
        menuContainer.innerHTML = ''; 

        // 1. TÁI TẠO QUAN HỆ 1-N TỪ DỮ LIỆU CHUẨN DB
        // Tạo một object để gom nhóm: { categoryId_1: { info, products: [] }, categoryId_2: {...} }
        const categoriesMap = {};

        products.forEach(product => {
            // Kiểm tra an toàn: Nếu sản phẩm chưa được gán category thì bỏ qua
            if (!product.category) return;

            const catId = product.category.id;

            // Nếu phân loại này chưa có trong Map, khởi tạo "Mảnh đất" cho nó
            if (!categoriesMap[catId]) {
                categoriesMap[catId] = {
                    id: product.category.id,
                    name: product.category.name,
                    description: product.category.description,
                    // Mảng rỗng chờ chứa các sản phẩm (chuẩn 1-N)
                    productsList: [] 
                };
            }

            // Nhét món ăn vào đúng phân loại của nó
            categoriesMap[catId].productsList.push(product);
        });


        // 2. DUYỆT QUA TỪNG PHÂN LOẠI (CATEGORY) VÀ VẼ RA GIAO DIỆN
        Object.values(categoriesMap).forEach(categoryInfo => {
            
            // Render danh sách các món ăn (N) thuộc Phân loại (1) này
            let foodCardsHTML = '';
            categoryInfo.productsList.forEach(food => {
                const formattedPrice = (food.price / 1000).toString();
                const description = food.description ? food.description : 'Đang cập nhật...';
                
                foodCardsHTML += `
                    <div class="food-card">
                        <div class="img-wrapper">
                            <img src="${food.imageUrl}" alt="${food.name}">
                            <div class="hover-overlay">
                                <button class="btn-choose">Chọn<br>món</button>
                            </div>
                        </div>
                        <div class="food-info">
                            <div class="title-price">
                                <h4 class="vi-title">${food.name}</h4>
                                <span class="price">| ${formattedPrice}</span>
                            </div>
                            <!-- Tên tiếng Anh chỗ này hiện tại lấy tạm tên Việt vì DB chưa có -->
                            <div class="en-title">${categoryInfo.name}</div>
                            <p class="desc">${description}</p>
                            <div class="meta">
                                <span class="rating">⭐ 4.6</span> 
                                <a href="#" class="read-more">Xem thêm</a>
                            </div>
                        </div>
                    </div>
                `;
            });

            // Vẽ Block hiển thị cho Phân Loại đó (Ảnh Banner bên trái + List món bên phải)
            const categoryBlockHTML = `
                <section class="category-block" style="display: flex; gap: 20px; margin-bottom: 50px;">
                    <!-- BÊN TRÁI: THÔNG TIN PHÂN LOẠI -->
                    <div class="category-banner-card" style="width: 30%;">
                        <div class="banner-img-box" style="padding: 15px; background: #fff; border-radius: 8px; height: 100%;">
                            <!-- Tạm thời dùng ảnh món đầu tiên làm ảnh đại diện cho Phân Loại -->
                            <img src="${categoryInfo.productsList[0].imageUrl}" alt="${categoryInfo.name}" style="width: 100%; border-radius: 5px;">
                            <h3 style="text-align: center; margin-top: 15px; color: #b35938;">
                                ${categoryInfo.name.toUpperCase()} 
                            </h3>
                        </div>
                    </div>

                    <!-- BÊN PHẢI: LIST MÓN ĂN -->
                    <div class="food-list" style="width: 70%; display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px;">
                        ${foodCardsHTML}
                    </div>
                </section>
            `;

            // Đẩy cái Block này lên web
            menuContainer.insertAdjacentHTML('beforeend', categoryBlockHTML);
        });

    } catch (error) {
        console.error('Lỗi khi fetch dữ liệu:', error);
        menuContainer.innerHTML = `<p style="color: red; font-weight: bold;">Lỗi render dữ liệu.</p>`;
    }
}