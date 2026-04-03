(function () {
    const params = new URLSearchParams(window.location.search);
    const name = params.get("name") || "";
    const phone = params.get("phone") || "";
    const address = params.get("address") || "";
    const note = params.get("note") || "";

    const greetEl = document.getElementById("thank-greet");
    const box = document.getElementById("thank-summary");
    if (!greetEl || !box) return;

    const displayName = name.trim() || "Quý khách";
    greetEl.textContent = displayName;

    function esc(s) {
        const d = document.createElement("div");
        d.textContent = s || "—";
        return d.innerHTML;
    }

    box.innerHTML = `
        <dl>
            <dt>Họ tên</dt><dd>${esc(name)}</dd>
            <dt>Điện thoại</dt><dd>${esc(phone)}</dd>
            <dt>Địa chỉ</dt><dd>${esc(address)}</dd>
            <dt>Ghi chú</dt><dd>${esc(note)}</dd>
        </dl>
    `;
})();
