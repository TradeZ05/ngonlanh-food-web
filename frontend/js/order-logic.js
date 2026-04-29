// Hàm định dạng tiền tệ Việt Nam
function formatVND(n) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);
}

// Hiển thị giỏ hàng
function renderOrderCart() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let html = "";
    let total = 0;

    cart.forEach((item, index) => {
        let subtotal = item.price * item.qty;
        total += subtotal;
        html += `
            <tr>
                <td>${item.name}</td>
                <td>${item.qty}</td>
                <td>${formatVND(item.price)}</td>
                <td>${formatVND(subtotal)}</td>
                <td>
                    <button class="btn-qty" onclick="changeQty(${index}, 1)">+</button>
                    <button class="btn-qty" onclick="changeQty(${index}, -1)">-</button>
                    <button class="btn-del" onclick="removeItem(${index})">Xoá</button>
                </td>
            </tr>
        `;
    });

    const cartContainer = document.getElementById("cart-items");
    if(cartContainer) cartContainer.innerHTML = html;
    
    const totalPrice = document.getElementById("total-price");
    if(totalPrice) totalPrice.innerText = formatVND(total);

    // Cập nhật cho trang dathang.html nếu đang ở đó
    if(document.getElementById("final-total")) {
        document.getElementById("final-total").innerText = formatVND(total);
        document.getElementById("deposit-amount").innerText = formatVND(total / 2);
    }
}

function changeQty(index, delta) {
    let cart = JSON.parse(localStorage.getItem("cart"));
    cart[index].qty += delta;
    if(cart[index].qty < 1) cart[index].qty = 1;
    localStorage.setItem("cart", JSON.stringify(cart));
    renderOrderCart();
}

function removeItem(index) {
    let cart = JSON.parse(localStorage.getItem("cart"));
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    renderOrderCart();
}

// Khởi tạo khi load trang
window.onload = renderOrderCart;