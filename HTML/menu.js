// menu.js - Menu and Cart Management Behavior
import { api } from './api.js';
import { renderContainerState } from './state.js';

const params = new URLSearchParams(window.location.search);
const RESTAURANT_ID = params.get('restaurantId') || 1;
const CUSTOMER_ID = 1; // Demo hard-coded customer ID per specs

let restaurant = null;
let menuItems = [];
let combos = [];
let cart = []; // Array of { menuItemId, name, unitPrice, qty }

document.addEventListener('DOMContentLoaded', () => {
    initMenu();
});

async function initMenu() {
    const mainEl = document.querySelector('.workspace');
    renderContainerState(mainEl, 'loading');

    try {
        [restaurant, menuItems, combos] = await Promise.all([
            api(`/restaurants/${RESTAURANT_ID}`),
            api(`/${RESTAURANT_ID}/menu`),
            api(`/${RESTAURANT_ID}/combos`)
        ]);
        renderMenuInterface();
    } catch (err) {
        renderContainerState(mainEl, 'error', { errorMsg: err.message, onRetry: initMenu });
    }
}

function renderMenuInterface() {
    const mainEl = document.querySelector('.workspace');
    if (!mainEl) return;

    mainEl.innerHTML = `
        <div style="flex: 2;">
            <div class="section-label">COMBOS</div>
            <div class="combos-grid" style="display: flex; flex-direction: column; gap: var(--space-2); margin-bottom: var(--space-5);">
                ${combos.map(c => `
                    <div class="card" style="display: flex; justify-content: space-between; align-items: center; padding: var(--space-3) var(--space-4);">
                        <div>
                            <h4>${c.name}</h4>
                            <p style="color: var(--accent); font-weight: 600;">${Number(c.price).toFixed(3)} OMR</p>
                        </div>
                        <button class="btn btn-primary" data-id="${c.id}" data-name="${c.name}" data-price="${c.price}" onclick="window.addCartLine(${c.id}, '${c.name}', ${c.price})">Add</button>
                    </div>
                `).join('')}
            </div>
            <div class="section-label">MENU</div>
            <div class="menu-stack" style="display: flex; flex-direction: column; gap: var(--space-2);">
                ${menuItems.map(item => {
                    const cartEntry = cart.find(x => x.menuItemId === item.id);
                    const qty = cartEntry ? cartEntry.qty : 0;
                    return `
                        <div class="card ${!item.isAvailable ? 'disabled-item' : ''}" style="display: flex; align-items: center; justify-content: space-between; padding: var(--space-3) var(--space-4);">
                            <div>
                                <h4 style="${!item.isAvailable ? 'text-decoration: line-through;' : ''}">${item.name}</h4>
                                <p style="font-size: var(--fs-cap); color: var(--muted);">${item.isVegetarian ? '🌱 Veg ' : ''} ${item.calories ? item.calories + ' kcal' : ''}</p>
                            </div>
                            <div style="display: flex; align-items: center; gap: var(--space-4);">
                                <span style="font-weight: 600; color: var(--accent);">${Number(item.price).toFixed(3)} OMR</span>
                                ${item.isAvailable ? (
                                    qty > 0 ? `<span class="badge" style="background: var(--brand-tint); color: var(--brand);">×${qty}</span>` :
                                    `<button class="btn btn-primary" onclick="window.addCartLine(${item.id}, '${item.name}', ${item.price})">Add</button>`
                                ) : `<button class="btn" disabled style="background: #e0dbd4;">Out</button>`}
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
        <div style="flex: 1;" class="card">
            <h3>Your Cart</h3>
            <div id="cart-lines" style="margin: var(--space-4) 0; display: flex; flex-direction: column; gap: var(--space-2);">
                ${cart.length === 0 ? '<p style="color: var(--muted); font-size: var(--fs-cap);">Cart is empty</p>' : 
                  cart.map(l => `<div style="display: flex; justify-content: space-between; font-size: var(--fs-cap);"><span>${l.name} ×${l.qty}</span><span>${(l.unitPrice * l.qty).toFixed(3)}</span></div>`).join('')}
            </div>
            <hr style="border: 0; border-top: 1px dashed var(--muted); margin: var(--space-3) 0;">
            <div style="display: flex; justify-content: space-between; font-size: var(--fs-cap);"><span>Subtotal</span><span>${calcSubtotal().toFixed(3)}</span></div>
            <div style="display: flex; justify-content: space-between; font-size: var(--fs-cap);"><span>Delivery</span><span>${Number(restaurant?.deliveryFee || 0.5).toFixed(3)}</span></div>
            <div style="display: flex; justify-content: space-between; font-weight: 700; margin: var(--space-3) 0;"><span>TOTAL</span><span style="color: var(--accent);">${calcTotal().toFixed(3)}</span></div>
            <button class="btn btn-primary" id="place-order-btn" style="width: 100%; border-radius: var(--radius-pill);" ${calcSubtotal() < (restaurant?.minOrderAmount || 2) ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''}>Place Order</button>
        </div>
    `;

    document.getElementById('place-order-btn')?.addEventListener('click', submitOrderSequence);
}

window.addCartLine = function(menuItemId, name, unitPrice) {
    const existing = cart.find(c => c.menuItemId === menuItemId);
    if (existing) existing.qty += 1;
    else cart.push({ menuItemId, name, unitPrice, qty: 1 });
    renderMenuInterface();
};

function calcSubtotal() {
    return cart.reduce((acc, row) => acc + (row.unitPrice * row.qty), 0);
}

function calcTotal() {
    return calcSubtotal() + (cart.length > 0 ? Number(restaurant?.deliveryFee || 0.5) : 0);
}

async function submitOrderSequence() {
    const btn = document.getElementById('place-order-btn');
    btn.textContent = 'Processing...';
    btn.disabled = true;

    try {
        const order = await api(`/orders/customer/${CUSTOMER_ID}/restaurant/${RESTAURANT_ID}`, { method: 'POST' });
        for (const line of cart) {
            await api(`/orders/${order.id}/items`, {
                method: 'POST',
                body: { menuItemId: line.menuItemId, quantity: line.qty, specialInstructions: '' }
            });
        }
        await api(`/orders/${order.id}/confirm`, { method: 'PUT' });
        window.location.href = `track.html?orderId=${order.id}`;
    } catch (err) {
        alert(`Order failed: ${err.message}`);
        btn.textContent = 'Place Order';
        btn.disabled = false;
    }
}