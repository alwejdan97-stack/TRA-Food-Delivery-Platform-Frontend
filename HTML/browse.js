// ===============================
// Search Input
// ===============================

const searchInput = document.querySelector(".header-search-input");

searchInput.addEventListener("focus", () => {
    searchInput.placeholder = "Search restaurants...";
    searchInput.value = "";
});

searchInput.addEventListener("blur", () => {
    if (searchInput.value.trim() === "") {
        searchInput.value = "Search restaurants...";
    }
});

// ===============================
// Cuisine Chips
// ===============================

const chips = document.querySelectorAll(".chip");

chips.forEach(chip => {

    chip.addEventListener("click", () => {

        chips.forEach(c => c.classList.remove("chip--active"));

        chip.classList.add("chip--active");

    });

});

// ===============================
// View Menu Buttons
// ===============================

const menuButtons = document.querySelectorAll(".btn--primary");

menuButtons.forEach(button => {

    button.addEventListener("click", () => {

        const restaurant =
            button.closest(".restaurant-card")
                  .querySelector("h3").textContent;

        alert(`Opening menu for ${restaurant}`);

        // Later Developer A will replace this with:
        // window.location.href =
        // `menu.html?restaurant=${restaurant}`;

    });

});

// ===============================
// Card Hover Effect
// ===============================

const cards = document.querySelectorAll(".restaurant-card");

cards.forEach(card => {

    card.addEventListener("mouseenter", () => {

        card.style.transform = "translateY(-8px)";

    });

    card.addEventListener("mouseleave", () => {

        card.style.transform = "translateY(0)";

    });

});

// ===============================
// Search Filter (UI Only)
// ===============================

searchInput.addEventListener("keyup", () => {

    const keyword = searchInput.value.toLowerCase();

    cards.forEach(card => {

        const restaurantName =
            card.querySelector("h3").textContent.toLowerCase();

        const cuisine =
            card.querySelector(".cuisine-tag").textContent.toLowerCase();

        if (
            restaurantName.includes(keyword) ||
            cuisine.includes(keyword)
        ) {

            card.style.display = "block";

        } else {

            card.style.display = "none";

        }

    });

});

// ===============================
// Location Badge
// ===============================

const locationBadge = document.querySelector(".location-badge");

locationBadge.addEventListener("click", () => {

    alert("Location selector will be added later.");

});

// ===============================
// User Avatar
// ===============================

const avatar = document.querySelector(".user-avatar");

avatar.addEventListener("click", () => {

    alert("User profile page coming soon.");

});