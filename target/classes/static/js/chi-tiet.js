(function () {
    const products = window.CHAY_PRODUCTS || [];
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    const product = products.find((p) => p.id === id);

    const root = document.getElementById("detail-root");
    if (!root) return;

    const formatPrice = (n) =>
        n.toLocaleString("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 });

    function escapeHtml(s) {
        const d = document.createElement("div");
        d.textContent = s;
        return d.innerHTML;
    }

    if (!product) {
        root.innerHTML = `
            <div class="detail-empty">
                <h1>Không tìm thấy món</h1>
                <p>Mã sản phẩm không hợp lệ hoặc món đã ngừng phục vụ.</p>
                <p><a class="btn btn-primary" href="/index.html">Về trang chủ</a></p>
            </div>
        `;
        document.title = "Không tìm thấy — Chay Xanh";
        return;
    }

    document.title = `${product.name} — Chay Xanh`;

    const ing = (product.ingredients || [])
        .map((x) => `<li>${escapeHtml(x)}</li>`)
        .join("");

    root.innerHTML = `
        <nav class="breadcrumb" aria-label="Breadcrumb">
            <a href="/index.html">Trang chủ</a>
            <span aria-hidden="true">/</span>
            <a href="/index.html#san-pham">Sản phẩm</a>
            <span aria-hidden="true">/</span>
            <span>${escapeHtml(product.name)}</span>
        </nav>
        <div class="detail-grid">
            <div class="detail-media">
                <img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.name)}" width="640" height="400" loading="eager" decoding="async">
            </div>
            <div class="detail-info">
                <p class="detail-tag">${escapeHtml(categoryLabel(product.category))}</p>
                <h1>${escapeHtml(product.name)}</h1>
                <p class="detail-price">${formatPrice(product.price)}</p>
                <p class="detail-desc">${escapeHtml(product.longDesc || product.desc)}</p>
                <dl class="detail-meta">
                    <div><dt>Thời gian chuẩn bị</dt><dd>${escapeHtml(product.prepTime || "—")}</dd></div>
                </dl>
                <div class="detail-actions">
                    <a class="btn btn-primary" href="/index.html?add=${encodeURIComponent(product.id)}">Thêm vào giỏ</a>
                    <a class="btn btn-ghost" href="/index.html#dat-hang">Đặt món &amp; giao hàng</a>
                </div>
                <section class="detail-ingredients">
                    <h2>Nguyên liệu nổi bật</h2>
                    <ul>${ing}</ul>
                </section>
                <p class="detail-allergens"><strong>Lưu ý:</strong> ${escapeHtml(product.allergens || "Không có thông tin.")}</p>
            </div>
        </div>
    `;

    function categoryLabel(cat) {
        const map = {
            "mon-nuoc": "Món nước",
            com: "Cơm & cơm hộp",
            "an-vat": "Ăn vặt",
        };
        return map[cat] || cat;
    }
})();
