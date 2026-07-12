import { api } from './api.js';

const params = new URLSearchParams(window.location.search);

const RESTAURANT_ID = params.get('restaurantId') || 1;
const CUSTOMER_ID = 1;

let restaurant = null;
let menuItems = [];
let combos = [];
let cart = [];

document.addEventListener('DOMContentLoaded', () => {
    // 1. Parse initial pre-rendered cart from HTML before init
    initCartFromDOM();
    
    // 2. Fetch data (if you want to override or keep API sync)
    initMenu();

    const backBtn = document.querySelector('.back-btn');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            window.location.href = "index.html";
        });
    }
});

// Seed the JS cart array using the static HTML items on load
function initCartFromDOM() {
    const itemRows = document.querySelectorAll("#cart-items-container .cart-line-row");
    cart = [];

    itemRows.forEach(row => {
        const nameText = row.querySelector(".cart-item-name")?.textContent || "";
        const totalText = row.querySelector(".cart-line-total")?.textContent || "0";

        // Parse format like "Shawarma ×2"
        const parts = nameText.split("×");
        if (parts.length === 2) {
            const name = parts[0].trim();
            const qty = Number(parts[1].trim());
            const total = Number(totalText);
            const unitPrice = qty > 0 ? total / qty : 0;

            cart.push({ name, unitPrice, qty });
        }
    });

    renderCart();
}

async function initMenu() {
    try {
        const results = await Promise.allSettled([
            api(`/restaurants/${RESTAURANT_ID}`),
            api(`/restaurants/${RESTAURANT_ID}/menu`),
            api(`/restaurants/${RESTAURANT_ID}/combos`)
        ]);

        if (results[0].status === 'fulfilled') restaurant = results[0].value;
        if (results[1].status === 'fulfilled') menuItems = results[1].value;
        if (results[2].status === 'fulfilled') combos = results[2].value;

        updateRestaurantInfo();
        setupCartButtons();

    } catch (err) {
        console.error("Loading error:", err);
    }
}

function updateRestaurantInfo() {
    if (!restaurant) return;

    const title = document.querySelector(".restaurant-meta h1");
    const details = document.querySelector(".restaurant-meta p");

    if (title) title.textContent = restaurant.name;
    if (details) {
        details.innerHTML = `${restaurant.cuisineType}
        <span class="dot">•</span>
        <span class="star-rating">★ ${restaurant.averageRating ?? "4.6"}</span>`;
    }
}

function setupCartButtons() {
    document.addEventListener("click", function(e) {
        // ADD BUTTON
        const addBtn = e.target.closest(".js-add-btn");
        if (addBtn) {
            const card = addBtn.closest(".ledger-row, .menu-row, .combo-card");
            if (!card) return;
            
            const name = card.dataset.name;
            const price = Number(card.dataset.price);

            addCartLine(name, price);
            updateCardUI(card, 1);
            return;
        }

        // PLUS BUTTON
        const plusBtn = e.target.closest(".js-plus");
        if (plusBtn) {
            const card = plusBtn.closest(".menu-row, .combo-card");
            if (!card) return;
            
            const name = card.dataset.name;
            const price = Number(card.dataset.price);
            const qtyElement = card.querySelector(".js-qty");
            let qty = Number(qtyElement.textContent);

            qty++;
            updateCardUI(card, qty);
            updateCartQuantity(name, price, qty);
            return;
        }
        
        // MINUS BUTTON
        const minusBtn = e.target.closest(".js-minus");
        if (minusBtn) {
            const card = minusBtn.closest(".menu-row, .combo-card");
            if (!card) return;
            
            const name = card.dataset.name;
            const price = Number(card.dataset.price);
            const qtyElement = card.querySelector(".js-qty");
            let qty = Number(qtyElement.textContent);

            qty--;
            if (qty < 0) qty = 0;

            updateCardUI(card, qty);
            updateCartQuantity(name, price, qty);
        }
    });
}

function updateCardUI(card, qty) {
    const qtyElement = card.querySelector(".js-qty");
    const stepper = card.querySelector(".stepper");
    const addBtn = card.querySelector(".js-add-btn");

    if (qtyElement) qtyElement.textContent = qty;

    if (qty > 0) {
        if (addBtn) addBtn.style.display = "none";
        if (stepper) {
            stepper.style.display = "flex";
            stepper.classList.add("active");
        }
    } else {
        if (stepper) {
            stepper.style.display = "none";
            stepper.classList.remove("active");
        }
        if (addBtn) addBtn.style.display = "inline-block";
    }
}

function renderCart() {
    const container = document.getElementById("cart-items-container");
    if (!container) return;

    let subtotal = 0;
    
    if (cart.length === 0) {
        container.innerHTML = `<div class="cart-line-row"><span class="cart-item-name" style="color: #888;">Your cart is empty</span><span class="cart-line-total">0.000</span></div>`;
    } else {
        container.innerHTML = cart.map(item => {
            const total = item.unitPrice * item.qty;
            subtotal += total;

            return `
            <div class="cart-line-row">
                <span class="cart-item-name">${item.name} ×${item.qty}</span>
                <span class="cart-line-total">${total.toFixed(3)}</span>
            </div>`;
        }).join("");
    }

    const subtotalEl = document.getElementById("subtotal-val");
    const totalEl = document.getElementById("total-val");
    const minOrderEl = document.querySelector(".min-order-status");

    if (subtotalEl) subtotalEl.textContent = subtotal.toFixed(3);
    if (totalEl) totalEl.textContent = (subtotal > 0 ? subtotal + 0.500 : 0.500).toFixed(3);

    if (minOrderEl) {
        if (subtotal >= 2.0) {
            minOrderEl.textContent = "min order 2.000 met";
            minOrderEl.style.color = "";
        } else {
            minOrderEl.textContent = `add ${(2.0 - subtotal).toFixed(3)} OMR more to reach minimum order`;
            minOrderEl.style.color = "#e53e3e";
        }
    }
}

function addCartLine(name, price) {
    const item = cart.find(i => i.name === name);
    if (item) {
        item.qty++;
    } else {
        cart.push({ name: name, unitPrice: price, qty: 1 });
    }
    renderCart();
}

function updateCartQuantity(name, price, qty) {
    const item = cart.find(i => i.name === name);
    if (qty === 0) {
        cart = cart.filter(i => i.name !== name);
    } else if (item) {
        item.qty = qty;
    } else {
        cart.push({ name: name, unitPrice: price, qty: qty });
    }
    renderCart();
}