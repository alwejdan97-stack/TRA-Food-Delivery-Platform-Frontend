import { api } from "./api.js";

let allRestaurants = [];
let activeCuisine = "All";
let searchQuery = "";

document.addEventListener("DOMContentLoaded", () => {
    initBrowse();
});

async function initBrowse() {

    try {
        allRestaurants = await api("/restaurants");
        renderRestaurants();
        setupBrowseListeners();

    } catch (error) {

        console.error(error);
        document.getElementById("restaurant-grid").innerHTML =
            "<h2>Unable to load restaurants.</h2>";

    }

}

function setupBrowseListeners() {
    const searchInput = document.getElementById("search-input");
    searchInput.addEventListener("input", function () {
        searchQuery = this.value.toLowerCase();
        renderRestaurants();
    });

    document.querySelectorAll(".chip").forEach(chip => {

        chip.addEventListener("click", function () {

            document.querySelectorAll(".chip")
                .forEach(c => c.classList.remove("chip--active"));

            this.classList.add("chip--active");

            activeCuisine = this.dataset.cuisine;

            renderRestaurants();

        });

    });

}

function renderRestaurants() {
    const gridEl = document.getElementById("restaurant-grid");
    let filtered = allRestaurants.filter(r => {
        const cuisineMatch =
            activeCuisine === "All" ||
            r.cuisineType === activeCuisine;
        const searchMatch =
            r.name.toLowerCase().includes(searchQuery);
        return cuisineMatch && searchMatch;
    });

    gridEl.innerHTML = "";

    filtered.forEach(r => {

        gridEl.innerHTML += `<article class="restaurant-card">
            <div class="restaurant-card__cover pattern-coral">
                <span class="status-badge ${r.acceptingOrders ? "status-badge--open" : "status-badge--paused"}">
                    ${r.acceptingOrders ? "Open" : "Paused"}
                </span>
            </div>

            <div class="restaurant-card__body">

                <div class="title-row">
                    <h3>${r.name}</h3>
                    <span class="rating">★ ${r.averageRating ?? "0.0"}</span>
                </div>

                <div class="cuisine-tag">${r.cuisineType}</div>

                <div class="metrics-row">
                    <div class="metric-field">
                        <span class="metric-label"> Delivery </span>

                        <span class="metric-value"> ${Number(r.deliveryFee).toFixed(3)} </span>
                    </div>

                    <div class="metric-field">
                        <span class="metric-label"> Min </span>

                        <span class="metric-value"> ${Number(r.minOrderAmount).toFixed(3)} </span>
                    </div>
                </div>

                <button class="btn btn--primary" onclick="location.href='menu.html?restaurantId=${r.id}'"> View Menu </button>
            </div>
        </article>
        `;
    });
}