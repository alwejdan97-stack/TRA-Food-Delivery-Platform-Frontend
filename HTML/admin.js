// admin.js - Admin & Reporting Dashboard Behavior
import { api } from './api.js';

document.addEventListener('DOMContentLoaded', () => {
    loadDashboardMetrics();
});

async function loadDashboardMetrics() {
    const today = new Date().toISOString().split('T')[0];
    try {
        const summary = await api(`/reports/platform/daily-summary?date=${today}`);
        const loyalty = await api('/reports/customers/top-loyalty');
        const drivers = await api('/reports/drivers/leaderboard');

        renderDashboard(summary, loyalty, drivers);
    } catch (err) {
        console.error('Dashboard error:', err);
    }
}

function renderDashboard(summary, loyalty, drivers) {
    const ordersEl = document.getElementById('metric-orders');
    if (ordersEl) ordersEl.textContent = summary?.totalOrders || '128';

    const loyaltyEl = document.getElementById('top-loyalty-list');
    if (loyaltyEl && Array.isArray(loyalty)) {
        loyaltyEl.innerHTML = loyalty.map(c => `<li>${c.name} — ${c.points} pts</li>`).join('');
    }
}