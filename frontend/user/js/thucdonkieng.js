
const searchInput = document.querySelector(".search-box input");
const items = document.querySelectorAll(".dietary-item");

if (searchInput) {
    searchInput.addEventListener("keyup", function () {
        let keyword = this.value.toLowerCase();

        items.forEach(item => {
            let text = item.innerText.toLowerCase();

            if (text.includes(keyword)) {
                item.style.display = "block";
            } else {
                item.style.display = "none";
            }
        });
    });
}


// =============================
// 🔔 NOTIFICATION BELL
// =============================
const bell = document.querySelector(".bell-circle");
const count = document.querySelector(".noti-count");

let notification = parseInt(count?.innerText) || 0;

if (bell) {
    bell.addEventListener("click", () => {
        notification++;
        count.innerText = notification;
    });
}



const viewLinks = document.querySelectorAll(".item-footer a");

viewLinks.forEach(link => {
    link.addEventListener("click", function (e) {
        e.preventDefault();

        let card = this.closest(".dietary-item");
        let name = card.querySelector(".name-price span").innerText;

        alert("Bạn đang xem chi tiết: " + name);
    });
});


items.forEach(item => {
    item.addEventListener("mouseenter", () => {
        item.style.transform = "scale(1.05)";
        item.style.transition = "0.3s";
    });

    item.addEventListener("mouseleave", () => {
        item.style.transform = "scale(1)";
    });
});