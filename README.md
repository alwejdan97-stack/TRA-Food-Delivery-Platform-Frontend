# Food Delivery Platform Frontend

A simple Food Delivery Platform frontend built with **HTML, CSS, and JavaScript**. The application communicates with a Spring Boot REST API backend to display restaurants, menus, and manage customer orders.

---

## Requirements

- Visual Studio Code
- Live Server extension
- Spring Boot Backend
- Modern web browser (Chrome, Edge, Firefox)

---

## Project Structure

```text
Food-Delivery-Frontend/
│
├── index.html
├── admin.html
├── menu.html
├── track.html
├── style.css
├── api.js
├── admin.js
├── menu.js
├── track.js
├── index.js
├── assets/
├── screenshots/
└── README.md
```

---

# How to Run

## 1. Start the Backend

Run your Spring Boot project from IntelliJ IDEA or using Maven.

```bash
mvn spring-boot:run
```

Wait until the application starts successfully.

---

## 2. Configure the Backend URL

Open **api.js** and set the backend URL.

```javascript
const BASE_URL = "http://localhost:8080";
```

If your backend runs on another port, replace the URL accordingly.

---

## 3. Run the Frontend

1. Open the frontend project in **Visual Studio Code**.
2. Install the **Live Server** extension.
3. Right-click **index.html**.
4. Select **Open with Live Server**.

The application will open automatically in your browser.

---

# Demo Customer

Use the following customer ID while testing:

```text
customerId = 1
```

If your database uses another customer, update the value in your JavaScript file.

---

# Backend URL

```
http://localhost:8080
```

---

# Technologies Used

- HTML5
- CSS3
- JavaScript (ES6)
- Spring Boot
- REST API
- MySQL

---

# Screenshots

## Home Page

![Home Page](screenshots/home.png)

---

## Restaurants Page

![Restaurants Page](screenshots/restaurants.png)

---

## Menu Page

![Menu Page](screenshots/menu.png)

---

## Cart Page

![Cart Page](screenshots/cart.png)

---

## Checkout / Order Confirmation

![Checkout](screenshots/checkout.png)

---

# Notes

- Start the Spring Boot backend before running the frontend.
- Ensure the backend URL in `api.js` is correct.
- Make sure your MySQL database contains sample data.
- Replace the screenshots above with your own images inside the `screenshots` folder.

---

# Author

**Wejdan Salim AlSubhi**
