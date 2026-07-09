import { api } from './api.js';

const params = new URLSearchParams(window.location.search);

const RESTAURANT_ID = params.get('restaurantId') || 1;
const CUSTOMER_ID = 1;

let restaurant = null;
let menuItems = [];
let combos = [];
let cart = [];

document.addEventListener('DOMContentLoaded', () => {
    initMenu();    
    const backBtn = document.querySelector('.back-btn');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            window.location.href = "index.html";
        });
    }
    /*setupStepperButtons();*/
});

async function initMenu() {
    try {
        [restaurant, menuItems, combos] = await Promise.all([
            api(`/restaurants/${RESTAURANT_ID}`),
            api(`/restaurants/${RESTAURANT_ID}/menu`),
            api(`/restaurants/${RESTAURANT_ID}/combos`)
        ]);

        console.log("Restaurant:", restaurant);
        console.log("Menu Items:", menuItems);
        console.log("Combos:", combos);

        /*updateRestaurantInfo();
        renderMenuFromAPI();
        console.log("Buttons:", document.querySelectorAll(".js-add-btn").length);
        console.log("Plus:", document.querySelectorAll(".js-plus").length);
        console.log("Minus:", document.querySelectorAll(".js-minus").length);        
        setupAddButtons();
        setupStepperButtons();*/

        renderMenuFromAPI();
        setupAddButtons();
        setupStepperButtons();

    } catch (err) {
        console.error("Loading error:",err);
    }
}

function updateRestaurantInfo(){

    if(!restaurant) return;

    const title =document.querySelector(".restaurant-meta h1");

    const details =document.querySelector(".restaurant-meta p");

    if(title){
        title.textContent = restaurant.name;
    }

    if(details){
        details.innerHTML = `${restaurant.cuisineType}
        <span class="dot">•</span>
        <span class="star-rating">
        ★ ${restaurant.averageRating ?? "0.0"}
        </span>`;
    }
}

function renderMenuFromAPI(){
    const combosContainer = document.querySelector(".combos-grid");
    const menuContainer = document.querySelector(".menu-stack");

    if(combosContainer){
        combosContainer.innerHTML = combos.map(combo => `
            <div class="combo-card"
                 data-name="${combo.name}"
                 data-price="${combo.price}">

                <div class="combo-info">
                    <h4>${combo.name}</h4>
                    <div class="combo-price">
                        ${Number(combo.price).toFixed(3)} OMR
                    </div>
                </div>

                <button class="btn-add-combo js-add-btn">Add</button>

                <div class="stepper active" style="display:none;">
                <button class="stepper-btn js-minus">−</button>
                <span class="stepper-value js-qty">0</span>
                <button class="stepper-btn js-plus">+</button>
                </div>

            </div>
        `).join("");
    }

    if(menuContainer){
        menuContainer.innerHTML = menuItems.map(item => `
            <div class="menu-row"
                 data-name="${item.name}"
                 data-price="${item.price}">

                <div class="menu-row__thumb"></div>
                <div class="menu-row__info">
                    <h4>${item.name}</h4>
                    <p>
                        ${item.isVegetarian ? "🌱 Veg" : ""}
                        ${item.calories ? item.calories + " kcal" : ""}
                    </p>
                </div>

                <div class="menu-row__price">${Number(item.price).toFixed(3)} OMR</div>

                <button class="btn-add js-add-btn">Add</button>
                <div class="stepper active" style="display:none;">
                <button class="stepper-btn js-minus">−</button>
                <span class="stepper-value js-qty">0</span>
                <button class="stepper-btn js-plus">+</button>
                </div>
            </div>`).join("");
    }
}

import { api } from './api.js';

const params = new URLSearchParams(window.location.search);

const RESTAURANT_ID = params.get('restaurantId') || 1;
const CUSTOMER_ID = 1;

let restaurant = null;
let menuItems = [];
let combos = [];
let cart = [];

document.addEventListener('DOMContentLoaded', () => {
    initMenu();    
    const backBtn = document.querySelector('.back-btn');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            window.location.href = "index.html";
        });
    }
    /*setupStepperButtons();*/
});

async function initMenu() {
    try {
        [restaurant, menuItems, combos] = await Promise.all([
            api(`/restaurants/${RESTAURANT_ID}`),
            api(`/restaurants/${RESTAURANT_ID}/menu`),
            api(`/restaurants/${RESTAURANT_ID}/combos`)
        ]);

        console.log("Restaurant:", restaurant);
        console.log("Menu Items:", menuItems);
        console.log("Combos:", combos);

        updateRestaurantInfo();
        renderMenuFromAPI();
        console.log("Buttons:", document.querySelectorAll(".js-add-btn").length);
        console.log("Plus:", document.querySelectorAll(".js-plus").length);
        console.log("Minus:", document.querySelectorAll(".js-minus").length);        
        setupAddButtons();
        setupStepperButtons();

    } catch (err) {
        console.error("Loading error:",err);
    }
}

function updateRestaurantInfo(){

    if(!restaurant) return;

    const title =document.querySelector(".restaurant-meta h1");

    const details =document.querySelector(".restaurant-meta p");

    if(title){
        title.textContent = restaurant.name;
    }

    if(details){
        details.innerHTML = `${restaurant.cuisineType}
        <span class="dot">•</span>
        <span class="star-rating">
        ★ ${restaurant.averageRating ?? "0.0"}
        </span>`;
    }
}

function renderMenuFromAPI(){
    const combosContainer = document.querySelector(".combos-grid");
    const menuContainer = document.querySelector(".menu-stack");

    if(combosContainer){
        combosContainer.innerHTML = combos.map(combo => `
            <div class="combo-card"
                 data-name="${combo.name}"
                 data-price="${combo.price}">

                <div class="combo-info">
                    <h4>${combo.name}</h4>
                    <div class="combo-price">
                        ${Number(combo.price).toFixed(3)} OMR
                    </div>
                </div>

                <button class="btn-add-combo js-add-btn">Add</button>

                <div class="stepper active" style="display:none;">
                <button class="stepper-btn js-minus">−</button>
                <span class="stepper-value js-qty">0</span>
                <button class="stepper-btn js-plus">+</button>
                </div>

            </div>
        `).join("");
    }

    if(menuContainer){
        menuContainer.innerHTML = menuItems.map(item => `
            <div class="menu-row"
                 data-name="${item.name}"
                 data-price="${item.price}">

                <div class="menu-row__thumb"></div>
                <div class="menu-row__info">
                    <h4>${item.name}</h4>
                    <p>
                        ${item.isVegetarian ? "🌱 Veg" : ""}
                        ${item.calories ? item.calories + " kcal" : ""}
                    </p>
                </div>

                <div class="menu-row__price">${Number(item.price).toFixed(3)} OMR</div>

                <button class="btn-add js-add-btn">Add</button>
                <div class="stepper active" style="display:none;">
                <button class="stepper-btn js-minus">−</button>
                <span class="stepper-value js-qty">0</span>
                <button class="stepper-btn js-plus">+</button>
                </div>
            </div>`).join("");
    }
}

function setupAddButtons() {
    document.querySelectorAll(".js-add-btn").forEach(button => {
        button.addEventListener("click", () => {
            const card = button.closest(".menu-row, .combo-card");
            const name = card.dataset.name;
            const price = Number(card.dataset.price);
            addCartLine(name, price);
            button.style.display = "none";
            const stepper = card.querySelector(".stepper");
            if(stepper){
                stepper.style.display = "flex";
            }
            card.querySelector(".js-qty").textContent = "1";
        });
    });
}



function updateMenuQuantity(name){
    document.querySelectorAll(".menu-row, .combo-card").forEach(card=>{
        if(card.dataset.name === name){
            const qtyElement = card.querySelector(".js-qty");
            if(qtyElement){
                const item = cart.find(i => i.name === name);
                qtyElement.textContent = item ? item.qty : 0;
            }
        }
    });
}

function renderCart(){
        console.log("Rendering cart");

    const container =document.getElementById("cart-items-container");
    console.log(container);

    let subtotal = 0;
    container.innerHTML = cart.map(item=>{
        const total =
        item.unitPrice * item.qty;
        subtotal += total;

        return `
        <div class="cart-line-row">
            <span>${item.name} × ${item.qty}
            </span>
            <span>${total.toFixed(3)}</span>
        </div>
        `;}).join("");

    document.getElementById("subtotal-val").textContent = subtotal.toFixed(3);
    document.getElementById("total-val").textContent = (subtotal + 0.500).toFixed(3);
}

function addCartLine(name, price){
    const item = cart.find(i => i.name === name);
    if(item){
        item.qty++;
    }
    else{
        cart.push({name:name,unitPrice:price,qty:1});
    }
    renderCart();
}

/*function updateMenuQuantity(name){
    document.querySelectorAll(".menu-row, .combo-card").forEach(card=>{
        if(card.dataset.name === name){
            const qtyElement = card.querySelector(".js-qty");
            if(qtyElement){
                const item = cart.find(i => i.name === name);
                qtyElement.textContent = item ? item.qty : 0;
            }
        }
    });
}*/

function renderCart(){
    const container=document.getElementById("cart-items-container");
    let subtotal = 0;

    container.innerHTML = cart.map(item=>{
        const total = item.unitPrice * item.qty;
        subtotal += total;
        return `<div class="cart-line-row">
            <span>${item.name} × ${item.qty}</span>
            <span>${total.toFixed(3)}</span>
        </div>`;}).join("");

    document.getElementById("subtotal-val").textContent =subtotal.toFixed(3);
    document.getElementById("total-val").textContent =(subtotal + 0.500).toFixed(3);
}

function setupStepperButtons(){
    document.querySelectorAll(".js-plus").forEach(btn=>{
        btn.addEventListener("click",()=>{
            const card = btn.closest(".menu-row, .combo-card");
            const qtyElement = card.querySelector(".js-qty");
            let qty = Number(qtyElement.textContent);
            qty++;
            qtyElement.textContent = qty;

            updateCartQuantity(card.dataset.name,Number(card.dataset.price),qty);
        });
    });


    document.querySelectorAll(".js-minus").forEach(btn=>{
        btn.addEventListener("click",()=>{
            const card = btn.closest(".menu-row, .combo-card");
            const qtyElement = card.querySelector(".js-qty");
            let qty = Number(qtyElement.textContent);

            if(qty > 0){
                qty--;
            }

            qtyElement.textContent = qty;

            updateCartQuantity(card.dataset.name,Number(card.dataset.price),qty);

            if(qty === 0){
               card.querySelector(".stepper").style.display="none";
                const addBtn = card.querySelector(".js-add-btn");
                if(addBtn){
                    addBtn.style.display="inline-block";
                }
            }
        });
    });
}

function updateCartQuantity(name, price, qty){
    const item = cart.find(i => i.name === name);
    if(qty === 0){
        cart = cart.filter(i => i.name !== name);
    }
    else if(item){
        item.qty = qty;
    }
    else{
        cart.push({name:name,unitPrice:price,qty:qty});
    }
    renderCart();
}