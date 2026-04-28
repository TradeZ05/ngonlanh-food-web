
const searchInput = document.querySelector(".search-box input");
const drinkCards = document.querySelectorAll(".drink-card, .drink-item");

searchInput.addEventListener("keyup", function () {
    let keyword = this.value.toLowerCase();

    drinkCards.forEach(card => {
        let name = card.innerText.toLowerCase();

        if (name.includes(keyword)) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    });
});


const bell = document.querySelector(".bell-box, .bell-circle");
const count = document.querySelector(".count, .noti-badge");

let notification = 0;

if (bell) {
    bell.addEventListener("click", () => {
        notification++;
        if (count) {
            count.innerText = notification;
        }
    });
}



const viewMoreLinks = document.querySelectorAll(".drink-footer a, .drink-bottom a");

viewMoreLinks.forEach(link => {
    link.addEventListener("click", function (e) {
        e.preventDefault();

        let card = this.closest(".drink-card, .drink-item");
        let name = card.querySelector("span").innerText;

        alert("Bạn đang xem chi tiết: " + name);
    });
});



drinkCards.forEach(card => {
    card.addEventListener("mouseenter", () => {
        card.style.transform = "scale(1.05)";
        card.style.transition = "0.3s";
    });

    card.addEventListener("mouseleave", () => {
        card.style.transform = "scale(1)";
    });
});