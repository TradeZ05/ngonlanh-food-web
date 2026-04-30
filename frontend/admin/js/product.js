// admin/js/product.js

// 1. Tải dimage sách Dimage mục (Category) vào thẻ <select>
async function loadCategories() {
    try {
        // Gọi API lấy dimage mục từ AdminCategoryController
        const categories = await apiRequest("/categories", "GET");
        const categorySelect = document.getElementById("category-select");

        if (categorySelect) {
            categorySelect.innerHTML = `<option value="">-- Chọn dimage mục --</option>` +
                categories.map(cat => `<option value="${cat.id}">${cat.name}</option>`).join('');
        }
    } catch (error) {
        console.error("Lỗi tải dimage mục:", error);
    }
}

// 2. Xử lý sự kiện Submit Form Thêm Sản Phẩm
async function handleAddProduct(event) {
    event.preventDefault(); // Ngăn không cho trình duyệt load lại trang

    const formData = new FormData();

    // Đóng gói thông tin text thành chuỗi JSON
    const productData = {
        name: document.getElementById("product-name").value,
        price: document.getElementById("product-price").value,
        description: document.getElementById("product-desc").value,
        categoryId: document.getElementById("category-select").value
    };

    // Append phần JSON (Phải ép kiểu thành Blob để Spring Boot hiểu @RequestPart("product"))
    formData.append("product", new Blob([JSON.stringify(productData)], { type: "application/json" }));

    // Append phần File Ảnh (Lấy file từ thẻ input type="file")
    const imageFile = document.getElementById("product-image").files[0];
    if (imageFile) {
        formData.append("image", imageFile);
    }

    try {
        // Bật nút loading (tùy chọn) để người dùng biết hệ thống đang xử lý upload ảnh
        const submitBtn = document.getElementById("btn-submit-product");
        if(submitBtn) submitBtn.innerText = "Đang tải lên...";

        // Gọi API thêm món (tham số thứ 4 'true' để đánh dấu đây là request multipart)
        await apiRequest("/products/add", "POST", formData, true);

        alert("Thêm món ăn thành công!");
        window.location.href = "thucdon.html"; // Chuyển về trang dimage sách thực đơn
    } catch (error) {
        alert("Lỗi khi thêm món: " + error.message);
    } finally {
        if(submitBtn) submitBtn.innerText = "Thêm món"; // Trả lại text cho nút
    }
}

// 3. Xóa món ăn
async function deleteProduct(productId) {
    if (confirm("Bạn có chắc chắn muốn xóa món này khỏi thực đơn?")) {
        try {
            await apiRequest(`/products/${productId}`, "DELETE");
            alert("Đã xóa thành công!");
            window.location.reload(); // Load lại trang để cập nhật dimage sách
        } catch (error) {
            alert("Lỗi khi xóa: " + error.message);
        }
    }
}

// Khởi chạy khi trang vừa load xong
document.addEventListener("DOMContentLoaded", () => {
    loadCategories();

    // Bắt sự kiện submit form nếu có form thêm món trên trang
    const addForm = document.getElementById("add-product-form");
    if (addForm) {
        addForm.addEventListener("submit", handleAddProduct);
    }
});