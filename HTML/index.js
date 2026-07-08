// index.js - Restaurant Browse Page Behavior
import { api } from './api.js';
import { renderContainerState } from './state.js';

let allRestaurants = [];
let activeCuisine = 'All';
let searchQuery = '';

document.addEventListener('DOMContentLoaded', () => {
    initBrowse();
});

async function initBrowse() {
    const gridEl = document.getElementById('restaurant-grid');
    renderContainerState(gridEl, 'loading', {
        loadingContent: Array(6).fill('<div class="skeleton" style="height: 180px; border-radius: var(--radius);"></div>').join('')
    });

    try {
        allRestaurants = await api('/restaurants') || [];
        renderRestaurants();
    } catch (err) {
        renderContainerState(gridEl, 'error', { errorMsg: err.message, onRetry: initBrowse });
    }

    setupBrowseListeners();
}

function setupBrowseListeners() {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        let timeout;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                searchQuery = e.target.value.trim().toLowerCase();
                renderRestaurants();
            }, 300);
        });
    }

    document.querySelectorAll('.chip').forEach(chip => {
        chip.addEventListener('click', (e) => {
            document.querySelectorAll('.chip').forEach(c => c.classList.remove('chip--active'));
            e.target.classList.add('chip--active');
            activeCuisine = e.target.dataset.cuisine || 'All';
            renderRestaurants();
        });
    });
}

function renderRestaurants() {
    const gridEl = document.getElementById('restaurant-grid');
    if (!gridEl) return;

    let filtered = allRestaurants.filter(r => {
        const matchesCuisine = activeCuisine === 'All' || r.cuisineType?.toLowerCase() === activeCuisine.toLowerCase();
        const matchesSearch = !searchQuery || r.name?.toLowerCase().includes(searchQuery);
        return matchesCuisine && matchesSearch;
    });

    if (filtered.length === 0) {
        renderContainerState(gridEl, 'empty');
        return;
    }

    gridEl.innerHTML = filtered.map(r => `
        <div class="card" style="display: flex; flex-direction: column; justify-content: space-between;">
            <div>
                <div style="background: var(--brand-tint); height: 80px; border-radius: var(--radius-sm); margin-bottom: var(--space-3);"></div>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <h3 style="font-size: var(--fs-lg); font-weight: 600;">${r.name}</h3>
                    <span class="badge" style="background: ${r.acceptingOrders ? 'var(--success)' : 'var(--muted)'}; color: #fff;">${r.acceptingOrders ? 'Open' : 'Paused'}</span>
                </div>
                <div style="display: flex; gap: var(--space-2); margin-top: var(--space-2); font-size: var(--fs-cap); color: var(--muted);">
                    <span class="chip" style="padding: 2px 8px;">${r.cuisineType || 'General'}</span>
                    ${r.averageRating ? `<span>★ ${r.averageRating.toFixed(1)}</span>` : ''}
                </div>
                <p style="font-size: var(--fs-cap); color: var(--muted); margin-top: var(--space-2);">Fee OMR ${Number(r.deliveryFee).toFixed(3)} · Min OMR ${Number(r.minOrderAmount).toFixed(3)}</p>
            </div>
            <button class="btn btn-primary" onclick="window.location.href='menu.html?restaurantId=${r.id}'" ${!r.acceptingOrders ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''} style="margin-top: var(--space-4); width: 100%;">View Menu</button>
        </div>
    `).join('');
}