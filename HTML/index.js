import { api } from "./api.js";

let allRestaurants = [];
let activeCuisine = "All";
let searchQuery = "";

document.addEventListener("DOMContentLoaded", () => {
    setupFilters();
    setupMenuButtons();
});

function setupFilters(){
    const cards = document.querySelectorAll(".restaurant-card");
    document.querySelectorAll(".chip").forEach(chip => {
        chip.addEventListener("click", function(){
            document.querySelectorAll(".chip").forEach(c => c.classList.remove("chip--active"));
            this.classList.add("chip--active");
            const selectedCuisine = this.dataset.cuisine;
            cards.forEach(card => {
                const cardCuisine = card.dataset.cuisine;
                if(selectedCuisine === "All" ||
                   cardCuisine === selectedCuisine){
                    card.style.display = "flex";
                }else{
                    card.style.display = "none";
                }
            });
        });
    });
}

function setupMenuButtons(){
    document.querySelectorAll(".restaurant-card .btn--primary").forEach((button,index)=>{
        button.addEventListener("click",()=>{
            const card = button.closest(".restaurant-card");
            const id = card.dataset.id;
            window.location.href =`menu.html?restaurantId=${id}`;
        });
    });
}
