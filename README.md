# .store — Multi-Page E-Commerce Web Application

A responsive, multi-page e-commerce storefront built with semantic HTML5, CSS3, and modular Vanilla JavaScript. The application simulates a complete online shopping experience—from browsing departments, electronics, and special flash deals to managing a persistent shopping cart, switching themes, and completing checkout.

---

## ✨ Key Features

- **Complete Storefront Flow:** Includes dedicated pages for the home landing page, category browsing, electronics catalog (`Electrical_products.html`), product listings (`product.html`), product details (`page-single.html`), limited-time flash offers (`page-offer.html`), shopping cart, checkout, wishlist, user account/order tracking, and authentication.
- **Dynamic Cart & State Management (`store.js` & `mock-api.js`):**
  - Add/remove products and adjust item quantities in real time.
  - Slide-out mini-cart preview in the header with live item counter and subtotal calculation.
  - Interactive coupon code application and shipping/tax estimator.
- **Dark & Light Mode (`theme.js`):** Seamless theme toggling across all pages with persistent user preference.
- **Rich Product Showcase:**
  - Synchronized product image gallery and thumbnail slider powered by **Swiper.js**.
  - Interactive color swatches, size selectors, stock availability progress bars, and live countdown timers.
  - Expandable product specifications, sizing charts, and interactive customer review submission.
- **Mobile-First Navigation:** Multi-column mega menus, collapsible department sidebar, off-canvas mobile drawer, fixed bottom navigation bar, and expandable mobile search overlay.

---

## 🛠️ Tech Stack

- **Frontend:** HTML5, CSS3 (Flexbox, CSS Grid, CSS Variables), JavaScript (ES6+)
- **Sliders & Carousels:** [Swiper.js v10](https://swiperjs.com/)
- **Icons:** [Remix Icon v3.5](https://remixicon.com/)

---

## 📁 Project Structure

```text
semifinalproject-e-commerce/
├── assets/
│   ├── banner/              # Promotional & category banners
│   ├── brands/              # Brand logos & partner assets
│   ├── menu/                # Mega menu & navigation visuals
│   ├── products/            # Product catalog images
│   └── slider/              # Homepage hero slider images
├── index.html               # Main storefront landing page
├── page-category.html       # Product catalog & filtering page
├── Electrical_products.html # Electronics & gadgets showcase page
├── product.html             # Product listing & catalog view
├── page-single.html         # Standard product details page
├── page-offer.html          # Flash deal / special offer product page
├── cart.html                # Shopping cart & shipping rate calculator
├── checkout.html            # Shipping form & order summary
├── wishlist.html            # Saved wishlist items
├── account.html             # User profile & order tracking
├── sign-in.html             # User sign-in & registration page
├── style.css                # Global stylesheet, responsive layouts & theme styles
├── mock-api.js              # Mock product catalog & backend data simulation
├── store.js                 # Cart, wishlist, and checkout logic
├── theme.js                 # Dark/Light theme toggle handler
├── script.js                # UI interactions, Swiper initialization & mobile menus
└── README.md                # Project documentation
```

---

## 🚀 Getting Started

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/HosamMosstfa/semifinalproject-e-commerce.git](https://github.com/HosamMosstfa/semifinalproject-e-commerce.git)
   ```
2. **Navigate to the project folder:**
   ```bash
   cd semifinalproject-e-commerce
   ```
3. **Run locally:**
   Open `index.html` directly in your browser, or launch it using the **Live Server** extension in VS Code for the best experience.

---

## 👤 Author

**Hossam Mostafa**

- GitHub: [@HosamMosstfa](https://github.com/HosamMosstfa)
- LinkedIn: [Hossam Mostafa](https://www.linkedin.com/in/hosammostfa)

---

## 📄 License

This project is open-source and available under the MIT License.
