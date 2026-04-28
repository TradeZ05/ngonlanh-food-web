// ==========================
// 1. HEADER SCROLL EFFECT
// ==========================
const header = document.querySelector('.top-bar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.style.boxShadow = "0 4px 10px rgba(0,0,0,0.1)";
        header.style.background = "#F5F5DC";
    } else {
        header.style.boxShadow = "none";
    }
});


// ==========================
// 2. NAVBAR ACTIVE CLICK
// ==========================
const navLinks = document.querySelectorAll('.navbar a');

navLinks.forEach(link => {
    link.addEventListener('click', function () {
        navLinks.forEach(item => item.classList.remove('active'));
        this.classList.add('active');
    });
});


// ==========================
// 3. SEARCH FUNCTION
// ==========================
const searchInput = document.querySelector('.search-box input');

searchInput.addEventListener('keyup', function (e) {
    const keyword = e.target.value.toLowerCase();

    const items = document.querySelectorAll('.item, .card-item, .dish-card');

    items.forEach(item => {
        const text = item.innerText.toLowerCase();

        if (text.includes(keyword)) {
            item.style.display = "block";
        } else {
            item.style.display = "none";
        }
    });
});


// ==========================
// 4. GIỎ HÀNG (ICON CHUÔNG)
// ==========================
let count = 0;

const bellButtons = document.querySelectorAll(
    '.bell-circle, .bell-container, .bell-bg, .bell-inner'
);

bellButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        count++;

        const badge = btn.querySelector(
            '.count, .noti-badge, .badge-count, .noti-count'
        );

        if (badge) {
            badge.innerText = count;
        }
    });
});


// ==========================
// 5. SCROLL TO TOP
// ==========================
const scrollBtn = document.createElement("button");
scrollBtn.innerText = "↑";
scrollBtn.style.position = "fixed";
scrollBtn.style.bottom = "20px";
scrollBtn.style.right = "20px";
scrollBtn.style.padding = "10px 15px";
scrollBtn.style.border = "none";
scrollBtn.style.borderRadius = "8px";
scrollBtn.style.background = "#965A3E";
scrollBtn.style.color = "#fff";
scrollBtn.style.cursor = "pointer";
scrollBtn.style.display = "none";

document.body.appendChild(scrollBtn);

window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
        scrollBtn.style.display = "block";
    } else {
        scrollBtn.style.display = "none";
    }
});

scrollBtn.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});