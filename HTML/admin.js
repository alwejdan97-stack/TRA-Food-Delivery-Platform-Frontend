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

    const revenueEl = document.getElementById('metric-revenue');
    if (revenueEl) {
        revenueEl.textContent = Number(summary?.totalRevenue || 0).toFixed(3);
    }

    const averageEl = document.getElementById('metric-average');
    if (averageEl) {
        averageEl.textContent =Number(summary?.averageOrder || 0).toFixed(3);
    }

    const cancelEl = document.getElementById('metric-cancel');
    if (cancelEl) {
        cancelEl.textContent =`${summary?.cancelRate || 0}%`;
    }

    const loyaltyEl = document.getElementById('top-loyalty-list');
    if (loyaltyEl && Array.isArray(loyalty)) {
        loyaltyEl.innerHTML = loyalty.map((c, index) => `
        <li class="loyalty-row">
            <div class="customer-info">
                <span class="rank-badge"> ${index + 1} </span>
                <span class="customer-name"> ${c.name} </span>
            </div>

            <span class="loyalty-points">
                ${c.points}
                <span class="pts-lbl">pts</span>
            </span>
        </li>`).join('');
    }

    const driverTable =
    document.querySelector('.leaderboard-table tbody');

    if (driverTable && Array.isArray(drivers)) {
        driverTable.innerHTML = drivers.map(driver => `
         <tr>
            <td class="driver-name-cell">${driver.name}</td>
            <td>${driver.completedOrders}</td>
            <td class="rating-cell">★ ${driver.rating}</td>
        </tr>`).join('');
    }
}