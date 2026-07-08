// track.js - Live Order Tracking Behavior
import { api } from './api.js';

const params = new URLSearchParams(window.location.search);
const ORDER_ID = params.get('orderId');

let pollInterval;
let etaSeconds = 0;
let countdownTimer;

document.addEventListener('DOMContentLoaded', () => {
    if (!ORDER_ID) return;
    pollOrderData();
    pollInterval = setInterval(pollOrderData, 5000);
    
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) clearInterval(pollInterval);
        else pollInterval = setInterval(pollOrderData, 5000);
    });
});

async function pollOrderData() {
    try {
        const [order, etaData] = await Promise.all([
            api(`/orders/${ORDER_ID}`),
            api(`/orders/${ORDER_ID}/eta`).catch(() => null)
        ]);

        updateTrackingUI(order, etaData);

        if (order.status === 'DELIVERED' || order.status === 'CANCELLED') {
            clearInterval(pollInterval);
            clearInterval(countdownTimer);
        }
    } catch (err) {
        console.error('Tracking poll error:', err);
    }
}

function updateTrackingUI(order, etaData) {
    const statusEl = document.getElementById('order-status-title');
    if (statusEl) statusEl.textContent = `Order ORD-${order.id} — ${order.status}`;
    
    if (etaData && etaData.etaMinutes) {
        etaSeconds = etaData.etaMinutes * 60;
        startCountdown();
    }
}

function startCountdown() {
    clearInterval(countdownTimer);
    countdownTimer = setInterval(() => {
        if (etaSeconds > 0) {
            etaSeconds--;
            const mins = Math.floor(etaSeconds / 60);
            const secs = etaSeconds % 60;
            const timerEl = document.getElementById('live-countdown');
            if (timerEl) timerEl.textContent = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
        } else {
            const timerEl = document.getElementById('live-countdown');
            if (timerEl) timerEl.textContent = 'Any minute now';
            clearInterval(countdownTimer);
        }
    }, 1000);
}