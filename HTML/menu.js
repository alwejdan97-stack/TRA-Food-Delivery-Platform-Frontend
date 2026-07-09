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
});

async function initMenu() {
    const mainEl = document.querySelector('.workspace-grid');
    if(!mainEl) return;
    mainEl.innerHTML = "<p>Loading...</p>";
    try {
        [restaurant, menuItems, combos] = await Promise.all([
            api(`/restaurants/${RESTAURANT_ID}`),
            api(`/restaurants/${RESTAURANT_ID}/menu`),
            api(`/restaurants/${RESTAURANT_ID}/combos`)
        ]);

        renderMenuInterface();

    } catch (err) {
        mainEl.innerHTML = `<p>Error: ${err.message}</p><button onclick="location.reload()">Retry</button>`;
    }
}

function renderMenuInterface() {
    const mainEl = document.querySelector('.workspace-grid');
    if (!mainEl) return;
    mainEl.innerHTML = `
        <div class="menu-section">
            <div class="category-label">COMBOS</div>

            <div class="combos-grid">
                ${(combos || []).map(combo => `<div class="combo-card">
                        <div class="combo-info">
                            <h4>${escapeHtml(combo.name)}</h4>
                            <div class="combo-price">
                                ${Number(combo.price).toFixed(3)} OMR
                            </div>
                        </div>

                        <button class="btn-add-combo" onclick="window.addCartLine(null, ${combo.id}, '${escapeAttribute(combo.name)}', ${combo.price})"> Add </button>
                    </div>`).join('')}
            </div>

            <div class="category-label"> MENU</div>
            <div class="menu-stack">${(menuItems || []).map(item => `
            <div class="menu-row">
                <div class="menu-row__info">
                    <h4>${escapeHtml(item.name)}</h4>
                    <p>
                        ${item.isVegetarian ? "🌱 Veg " : ""}
                        ${item.calories ? item.calories + " kcal" : ""}
                    </p>
                </div>

                <div class="menu-row__price">
                    ${Number(item.price).toFixed(3)} OMR
                </div>
                <button class="btn-add" onclick="window.addCartLine(${item.id}, null, '${escapeAttribute(item.name)}', ${item.price})"> Add</button>
            </div>`).join('')
    }

            </div>
        </div>`;
}

window.addCartLine = function(
    menuItemId,
    comboMealId,
    name,
    unitPrice
){const existing = cart.find(item => item.menuItemId === menuItemId && item.comboMealId === comboMealId );
    if(existing){
        existing.qty++;
    } else {
        cart.push({menuItemId,comboMealId,name,unitPrice,qty:1
        });
    }
    console.log(cart);
};

function escapeHtml(text){
    return String(text).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;");
}

function escapeAttribute(text){
    return String(text).replaceAll("&","&amp;").replaceAll('"',"&quot;").replaceAll("'","&#039;");
}