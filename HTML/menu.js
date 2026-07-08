// Minimal functional JS state driver mapping interactive clicks to the UI tally
document.addEventListener("DOMContentLoaded", () => {
    const cartContainer = document.getElementById("cart-items-container");
    const subtotalEl = document.getElementById("subtotal-val");
    const totalEl = document.getElementById("total-val");

    // Tracks item counts
    const cartState = {
        "Shawarma": { price: 0.500, qty: 2 },
        "Hummus": { price: 0.600, qty: 1 },
        "Family Box": { price: 3.500, qty: 1 }
    };

    function updateCartUI() {
        cartContainer.innerHTML = "";
        let subtotal = 0;

        for (const [name, data] of Object.entries(cartState)) {
            if (data.qty > 0) {
                const itemTotal = data.price * data.qty;
                subtotal += itemTotal;

                const row = document.createElement("div");
                row.className = "cart-line-row";
                row.innerHTML = `
                    <span class="cart-item-name">${name} ×${data.qty}</span>
                    <span class="cart-line-total">${itemTotal.toFixed(3)}</span>
                `;
                cartContainer.appendChild(row);
            }
        }

        subtotalEl.textContent = subtotal.toFixed(3);
        totalEl.textContent = (subtotal + 0.500).toFixed(3);
    }

    // Attach click events to dynamic elements
    document.querySelectorAll(".js-add-btn").forEach(button => {
        button.addEventListener("click", (e) => {
            const parent = e.target.closest("[data-name]");
            const name = parent.dataset.name;
            const price = parseFloat(parent.dataset.price);

            if (!cartState[name]) {
                cartState[name] = { price: price, qty: 0 };
            }
            cartState[name].qty += 1;
            updateCartUI();
        });
    });
});