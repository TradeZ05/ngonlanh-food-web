(function () {
    const products = window.CHAY_PRODUCTS || [];

    const formatPrice = (n) =>
        n.toLocaleString("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 });

    const grid = document.getElementById("product-grid");
    const chips = document.querySelectorAll(".chip");
    let activeFilter = "all";

    function renderProducts() {
        if (!grid) return;
        grid.innerHTML = "";
        const filtered =
            activeFilter === "all"
                ? products
                : products.filter((p) => p.category === activeFilter);

        filtered.forEach((p) => {
            const article = document.createElement("article");
            article.className = "product-card";
            article.dataset.id = p.id;
            article.innerHTML = `
                <a class="product-thumb" href="/chi-tiet.html?id=${encodeURIComponent(p.id)}">
                    <img src="${escapeAttr(p.image)}" alt="${escapeAttr(p.name)}" width="320" height="200" loading="lazy" decoding="async">
                </a>
                <div class="product-body">
                    <span class="product-tag">${categoryLabel(p.category)}</span>
                    <h3><a class="product-title-link" href="/chi-tiet.html?id=${encodeURIComponent(p.id)}">${escapeHtml(p.name)}</a></h3>
                    <p class="desc">${escapeHtml(p.desc)}</p>
                    <div class="product-meta">
                        <span class="price">${formatPrice(p.price)}</span>
                        <button type="button" class="btn-add" data-add="${escapeAttr(p.id)}">Thêm</button>
                    </div>
                    <a class="product-detail-link" href="/chi-tiet.html?id=${encodeURIComponent(p.id)}">Xem chi tiết</a>
                </div>
            `;
            grid.appendChild(article);
        });
    }

    function categoryLabel(cat) {
        const map = {
            "mon-nuoc": "Món nước",
            com: "Cơm",
            "an-vat": "Ăn vặt",
        };
        return map[cat] || cat;
    }

    function escapeHtml(s) {
        const d = document.createElement("div");
        d.textContent = s;
        return d.innerHTML;
    }

    function escapeAttr(s) {
        return String(s).replace(/"/g, "&quot;");
    }

    chips.forEach((chip) => {
        chip.addEventListener("click", () => {
            chips.forEach((c) => c.classList.remove("is-active"));
            chip.classList.add("is-active");
            activeFilter = chip.dataset.filter || "all";
            renderProducts();
        });
    });

    if (grid) {
        grid.addEventListener("click", (e) => {
            const btn = e.target.closest("[data-add]");
            if (!btn) return;
            e.preventDefault();
            const id = btn.getAttribute("data-add");
            addToCart(id);
        });
    }

    const cart = [];
    const cartBadge = document.querySelector(".cart-badge");
    const cartList = document.getElementById("cart-list");
    const cartEmpty = document.getElementById("cart-empty");
    const cartFooter = document.getElementById("cart-footer");
    const cartTotalEl = document.getElementById("cart-total");
    const drawer = document.getElementById("cart-drawer");
    const backdrop = document.getElementById("cart-backdrop");
    const toggles = document.querySelectorAll(".cart-toggle");

    function addToCart(id) {
        const p = products.find((x) => x.id === id);
        if (!p) return;
        const line = cart.find((l) => l.id === id);
        if (line) line.qty += 1;
        else cart.push({ id, name: p.name, price: p.price, qty: 1 });
        updateCartUi();
    }

    function cartTotal() {
        return cart.reduce((sum, l) => sum + l.price * l.qty, 0);
    }

    function updateCartUi() {
        if (!cartBadge) return;
        const count = cart.reduce((s, l) => s + l.qty, 0);
        cartBadge.textContent = String(count);

        if (!cartList || !cartEmpty || !cartFooter) return;

        if (cart.length === 0) {
            cartEmpty.hidden = false;
            cartList.hidden = true;
            cartFooter.hidden = true;
            cartList.innerHTML = "";
        } else {
            cartEmpty.hidden = true;
            cartList.hidden = false;
            cartFooter.hidden = false;
            cartList.innerHTML = cart
                .map(
                    (l) =>
                        `<li><span>${escapeHtml(l.name)} × ${l.qty}</span><span>${formatPrice(
                            l.price * l.qty
                        )}</span></li>`
                )
                .join("");
            if (cartTotalEl) cartTotalEl.textContent = formatPrice(cartTotal());
        }
    }

    function setCartOpen(open) {
        if (!drawer) return;
        drawer.classList.toggle("is-open", open);
        drawer.setAttribute("aria-hidden", open ? "false" : "true");
        if (backdrop) backdrop.hidden = !open;
        document.body.classList.toggle("cart-open", open);
    }

    toggles.forEach((el) => {
        el.addEventListener("click", () => {
            if (!drawer) return;
            const open = !drawer.classList.contains("is-open");
            setCartOpen(open);
        });
    });

    if (backdrop) {
        backdrop.addEventListener("click", () => setCartOpen(false));
    }

    const params = new URLSearchParams(window.location.search);
    const addId = params.get("add");
    if (addId) {
        addToCart(addId);
        if (window.history.replaceState) {
            window.history.replaceState({}, "", window.location.pathname + window.location.hash);
        }
    }

    renderProducts();
    updateCartUi();
})();
