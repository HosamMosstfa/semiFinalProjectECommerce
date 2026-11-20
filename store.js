(function () {
  const KEYS = {
    CART: "dotstore_cart_v1",
    WISHLIST: "dotstore_wishlist_v1",
    COMPARE: "dotstore_compare_v1",
    RECENT: "dotstore_recent_v1",
    USER: "dotstore_user_v1",
    USERS_DB: "dotstore_users_db_v1",
    ORDERS: "dotstore_orders_v1",
    COUPON: "dotstore_coupon_v1",
    SHIPPING: "dotstore_shipping_v1",
    DESTINATION: "dotstore_destination_v1",
    CURRENCY: "dotstore_currency_v1",
    REVIEWS: "dotstore_reviews_v1",
    SELECTED_PRODUCT: "dotstore_selected_product_v1",
    SEARCH_QUERY: "dotstore_search_query_v1",
    CATEGORY_FILTER: "dotstore_category_filter_v1",
    PROMO_DISMISSED: "dotstore_promo_dismissed_v1",
  };

  const CURRENCIES = {
    USD: { symbol: "$", rate: 1 },
    EURO: { symbol: "€", rate: 0.92 },
    GBP: { symbol: "£", rate: 0.79 },
    IDR: { symbol: "Rp ", rate: 15800 },
  };

  const COUPONS = {
    SAVE10: { code: "SAVE10", type: "percent", value: 10, label: "10% Off" },
    WELCOME20: {
      code: "WELCOME20",
      type: "fixed",
      value: 20,
      label: "$20 Off",
    },
    STORE100: {
      code: "STORE100",
      type: "fixed",
      value: 100,
      label: "$100 Off",
    },
    FREESHIP: {
      code: "FREESHIP",
      type: "freeship",
      value: 0,
      label: "Free Shipping",
    },
  };

  const COUNTRY_RATES = {
    "": { name: "Standard", shippingSurcharge: 0, taxRate: 0 },
    1: { name: "UK", shippingSurcharge: 5, taxRate: 0.05 },
    2: { name: "United States", shippingSurcharge: 0, taxRate: 0.04 },
    3: { name: "China", shippingSurcharge: 8, taxRate: 0.03 },
    4: { name: "Egypt", shippingSurcharge: 4, taxRate: 0.02 },
    5: { name: "Saudi Arabia", shippingSurcharge: 3, taxRate: 0.05 },
  };

  const listeners = [];

  function read(key, fallback) {
    try {
      const raw = sessionStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      return fallback;
    }
  }

  function write(key, value) {
    try {
      sessionStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn("sessionStorage write error:", e);
    }
    notify();
  }

  function notify() {
    listeners.forEach((fn) => {
      try {
        fn();
      } catch (e) {
        console.error(e);
      }
    });
  }

  function seedInitialSession() {
    if (!sessionStorage.getItem(KEYS.CART)) {
      sessionStorage.setItem(
        KEYS.CART,
        JSON.stringify([
          { key: "home2__Gold", id: "home2", qty: 2, variant: "Gold" },
          { key: "home3__Stand", id: "home3", qty: 1, variant: "Stand" },
          { key: "home4__Default", id: "home4", qty: 1, variant: "" },
          {
            key: "home5__King Size",
            id: "home5",
            qty: 1,
            variant: "King Size",
          },
        ]),
      );
    }
    if (!sessionStorage.getItem(KEYS.WISHLIST)) {
      sessionStorage.setItem(
        KEYS.WISHLIST,
        JSON.stringify(["apparel4", "electronic1"]),
      );
    }
    if (!sessionStorage.getItem(KEYS.COMPARE)) {
      sessionStorage.setItem(KEYS.COMPARE, JSON.stringify([]));
    }
    if (!sessionStorage.getItem(KEYS.SHIPPING)) {
      sessionStorage.setItem(KEYS.SHIPPING, JSON.stringify("flat"));
    }
    if (!sessionStorage.getItem(KEYS.DESTINATION)) {
      sessionStorage.setItem(
        KEYS.DESTINATION,
        JSON.stringify({ country: "", state: "", postal: "" }),
      );
    }
    if (!sessionStorage.getItem(KEYS.CURRENCY)) {
      sessionStorage.setItem(KEYS.CURRENCY, JSON.stringify("USD"));
    }
    if (!sessionStorage.getItem(KEYS.USERS_DB)) {
      sessionStorage.setItem(
        KEYS.USERS_DB,
        JSON.stringify([
          {
            id: "USR-1001",
            name: "Hossam Mostafa",
            email: "hossam@store.com",
            password: "123456",
            phone: "+966500000000",
            address: "King Fahd Road",
            city: "Dammam",
            country: "Saudi Arabia",
          },
        ]),
      );
    }
    if (!sessionStorage.getItem(KEYS.ORDERS)) {
      sessionStorage.setItem(
        KEYS.ORDERS,
        JSON.stringify([
          {
            id: "ORD-2026-8410",
            date: "2026-11-18",
            status: "Delivered",
            paymentMethod: "Credit Card (•••• 4242)",
            customer: {
              name: "Hossam Mostafa",
              email: "hossam@store.com",
              city: "Dammam",
              address: "King Fahd Road",
            },
            items: [
              {
                id: "electronic1",
                name: "ROG Strix G18 (2023) G814JZ-N6036X",
                price: 480.9,
                qty: 1,
                variant: "Eclipse Gray",
                image: "assets/products/electronic1.jpg",
              },
            ],
            subtotal: 480.9,
            discount: 0,
            shipping: 10.0,
            tax: 0,
            total: 490.9,
          },
        ]),
      );
    }
  }

  seedInitialSession();

  window.Store = {
    KEYS,
    subscribe(fn) {
      if (typeof fn === "function") listeners.push(fn);
    },

    // --- العملات ---
    getCurrency() {
      return read(KEYS.CURRENCY, "USD");
    },
    setCurrency(code) {
      if (CURRENCIES[code]) {
        write(KEYS.CURRENCY, code);
        this.toast(`Currency switched to ${code}`);
      }
    },
    formatPrice(usdAmount) {
      const code = this.getCurrency();
      const cfg = CURRENCIES[code] || CURRENCIES.USD;
      const converted = Number(usdAmount || 0) * cfg.rate;
      if (code === "IDR") {
        return cfg.symbol + Math.round(converted).toLocaleString("en-US");
      }
      return (
        cfg.symbol +
        converted.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      );
    },

    // --- السلة ---
    getCart() {
      const rawCart = read(KEYS.CART, []);
      return rawCart
        .map((entry) => {
          const product = window.MockApi
            ? window.MockApi.getProductSync(entry.id)
            : null;
          if (!product) return null;
          return {
            ...entry,
            name: product.name,
            price: product.price,
            image: product.image,
            category: product.category,
            stock: product.stock,
            lineTotal: product.price * entry.qty,
          };
        })
        .filter(Boolean);
    },
    getCartCount() {
      return this.getCart().reduce((sum, item) => sum + item.qty, 0);
    },
    addToCart(productId, qty = 1, variant = "") {
      const product = window.MockApi.getProductSync(productId);
      if (!product) return false;
      if (product.stock <= 0) {
        this.toast(`Sorry, "${product.name}" is currently out of stock.`);
        return false;
      }
      const cart = read(KEYS.CART, []);
      const cleanVariant = String(variant || "").trim();
      const key = `${productId}__${cleanVariant || "Default"}`;
      const existing = cart.find((item) => item.key === key);
      const requested = Math.max(1, Number(qty));

      if (existing) {
        if (existing.qty + requested > product.stock) {
          existing.qty = product.stock;
          write(KEYS.CART, cart);
          this.toast(
            `Max available stock (${product.stock}) reached for "${product.name}"`,
          );
          return true;
        }
        existing.qty += requested;
      } else {
        cart.push({
          key,
          id: productId,
          qty: Math.min(product.stock, requested),
          variant: cleanVariant,
        });
      }
      write(KEYS.CART, cart);
      this.toast(`Added "${product.name}" to cart`);
      return true;
    },
    updateCartQty(key, qty) {
      const cart = read(KEYS.CART, []);
      const idx = cart.findIndex((item) => item.key === key);
      if (idx === -1) return;
      const product = window.MockApi.getProductSync(cart[idx].id);
      const maxStock = product ? Math.max(1, product.stock) : 99;
      const parsed = Number(qty);
      if (parsed <= 0) {
        cart.splice(idx, 1);
      } else {
        cart[idx].qty = Math.min(maxStock, parsed);
      }
      write(KEYS.CART, cart);
    },
    removeFromCart(key) {
      const cart = read(KEYS.CART, []).filter((item) => item.key !== key);
      write(KEYS.CART, cart);
      this.toast("Item removed from cart");
    },
    clearCart() {
      write(KEYS.CART, []);
      write(KEYS.COUPON, null);
    },

    // --- الكوبونات والشحن والضرائب ---
    getCoupon() {
      return read(KEYS.COUPON, null);
    },
    applyCoupon(code) {
      const clean = String(code || "")
        .trim()
        .toUpperCase();
      if (!clean) {
        write(KEYS.COUPON, null);
        return { ok: false, message: "Please enter a coupon code." };
      }
      const found = COUPONS[clean];
      if (!found) {
        return {
          ok: false,
          message: "Invalid code. Try: SAVE10, WELCOME20, STORE100, FREESHIP",
        };
      }
      write(KEYS.COUPON, found);
      this.toast(`Coupon ${found.code} (${found.label}) applied!`);
      return { ok: true, coupon: found };
    },
    getShippingMethod() {
      return read(KEYS.SHIPPING, "flat");
    },
    setShippingMethod(method) {
      write(KEYS.SHIPPING, method === "best" ? "best" : "flat");
    },
    getDestination() {
      return read(KEYS.DESTINATION, { country: "", state: "", postal: "" });
    },
    setDestination(dest) {
      const current = this.getDestination();
      write(KEYS.DESTINATION, { ...current, ...dest });
    },
    getTotals() {
      const items = this.getCart();
      const subtotal = items.reduce(
        (sum, item) => sum + item.price * item.qty,
        0,
      );
      const coupon = this.getCoupon();
      const shippingMethod = this.getShippingMethod();
      const dest = this.getDestination();
      const rateCfg = COUNTRY_RATES[dest.country] || COUNTRY_RATES[""];

      let shipping =
        items.length === 0
          ? 0
          : shippingMethod === "best"
            ? 0
            : 10 + rateCfg.shippingSurcharge;
      let discount = 0;

      if (coupon && subtotal > 0) {
        if (coupon.type === "percent")
          discount = subtotal * (coupon.value / 100);
        if (coupon.type === "fixed")
          discount = Math.min(subtotal, coupon.value);
        if (coupon.type === "freeship") shipping = 0;
      }

      const taxable = Math.max(0, subtotal - discount);
      const tax = items.length === 0 ? 0 : taxable * rateCfg.taxRate;
      const total = Math.max(0, taxable + shipping + tax);

      return {
        subtotal,
        discount,
        shipping,
        tax,
        shippingMethod,
        coupon,
        total,
      };
    },

    // --- المفضلة ---
    getWishlist() {
      return read(KEYS.WISHLIST, []);
    },
    isInWishlist(productId) {
      return this.getWishlist().includes(productId);
    },
    toggleWishlist(productId) {
      const list = this.getWishlist();
      const idx = list.indexOf(productId);
      const product = window.MockApi.getProductSync(productId);
      if (idx === -1) {
        list.push(productId);
        write(KEYS.WISHLIST, list);
        if (product) this.toast(`Saved "${product.name}" to wishlist`);
        return true;
      } else {
        list.splice(idx, 1);
        write(KEYS.WISHLIST, list);
        if (product) this.toast(`Removed "${product.name}" from wishlist`);
        return false;
      }
    },

    // --- مقارنة المنتجات (Compare) ---
    getCompareList() {
      return read(KEYS.COMPARE, []);
    },
    isInCompare(productId) {
      return this.getCompareList().includes(productId);
    },
    toggleCompare(productId) {
      const list = this.getCompareList();
      const idx = list.indexOf(productId);
      const product = window.MockApi.getProductSync(productId);
      if (idx !== -1) {
        list.splice(idx, 1);
        write(KEYS.COMPARE, list);
        if (product) this.toast(`Removed "${product.name}" from comparison`);
        return false;
      }
      if (list.length >= 3) {
        this.toast("You can compare up to 3 products at a time.");
        return false;
      }
      list.push(productId);
      write(KEYS.COMPARE, list);
      if (product)
        this.toast(`Added "${product.name}" to compare (${list.length}/3)`);
      return true;
    },
    clearCompare() {
      write(KEYS.COMPARE, []);
    },

    // --- المشاهدة مؤخراً ---
    recordRecentlyViewed(productId) {
      if (!productId) return;
      const list = read(KEYS.RECENT, []).filter((id) => id !== productId);
      list.unshift(productId);
      write(KEYS.RECENT, list.slice(0, 6));
    },
    getRecentlyViewed() {
      return read(KEYS.RECENT, [])
        .map((id) => window.MockApi.getProductSync(id))
        .filter(Boolean);
    },

    // --- الحسابات والمستخدمين ---
    getCurrentUser() {
      return read(KEYS.USER, null);
    },
    signIn(email, password) {
      const users = read(KEYS.USERS_DB, []);
      const cleanEmail = String(email || "")
        .trim()
        .toLowerCase();
      const found = users.find(
        (u) =>
          u.email.toLowerCase() === cleanEmail &&
          u.password === String(password || ""),
      );
      if (!found) {
        return { ok: false, message: "Invalid email or password." };
      }
      const { password: _, ...safeUser } = found;
      write(KEYS.USER, safeUser);
      this.toast(`Welcome back, ${safeUser.name}!`);
      return { ok: true, user: safeUser };
    },
    signUp({
      name,
      email,
      password,
      phone = "",
      city = "",
      address = "",
      country = "",
    }) {
      const users = read(KEYS.USERS_DB, []);
      const cleanEmail = String(email || "")
        .trim()
        .toLowerCase();
      if (!name || !cleanEmail || !password) {
        return { ok: false, message: "All required fields must be filled." };
      }
      if (users.some((u) => u.email.toLowerCase() === cleanEmail)) {
        return { ok: false, message: "Email is already registered." };
      }
      const newUser = {
        id: "USR-" + Math.floor(1000 + Math.random() * 9000),
        name: name.trim(),
        email: cleanEmail,
        password: String(password),
        phone,
        city,
        address,
        country,
      };
      users.push(newUser);
      write(KEYS.USERS_DB, users);
      const { password: _, ...safeUser } = newUser;
      write(KEYS.USER, safeUser);
      this.toast(`Account created! Welcome, ${safeUser.name}`);
      return { ok: true, user: safeUser };
    },
    updateProfile(updates) {
      const current = this.getCurrentUser();
      if (!current) return null;
      const updated = { ...current, ...updates };
      write(KEYS.USER, updated);
      const users = read(KEYS.USERS_DB, []);
      const idx = users.findIndex((u) => u.id === current.id);
      if (idx !== -1) {
        users[idx] = { ...users[idx], ...updates };
        write(KEYS.USERS_DB, users);
      }
      this.toast("Profile updated successfully!");
      return updated;
    },
    signOut() {
      write(KEYS.USER, null);
      this.toast("Signed out successfully");
    },

    // --- الطلبات وتتبع الشحن ---
    getOrders() {
      return read(KEYS.ORDERS, []);
    },
    getOrderById(orderId) {
      const clean = String(orderId || "")
        .trim()
        .toUpperCase();
      return this.getOrders().find((o) => o.id.toUpperCase() === clean) || null;
    },
    placeOrder(customerInfo, notes = "", paymentMethod = "Cash on Delivery") {
      const items = this.getCart();
      if (!items.length) return { ok: false, message: "Your cart is empty." };
      const totals = this.getTotals();
      const order = {
        id: "ORD-2026-" + Math.floor(1000 + Math.random() * 9000),
        date: new Date().toISOString().slice(0, 10),
        status: "Confirmed & Processing",
        paymentMethod,
        customer: customerInfo,
        notes,
        items: items.map((i) => ({
          id: i.id,
          name: i.name,
          price: i.price,
          qty: i.qty,
          variant: i.variant,
          image: i.image,
        })),
        subtotal: totals.subtotal,
        discount: totals.discount,
        shipping: totals.shipping,
        tax: totals.tax,
        total: totals.total,
      };
      window.MockApi.decrementStock(items);
      const orders = this.getOrders();
      orders.unshift(order);
      write(KEYS.ORDERS, orders);
      this.clearCart();
      return { ok: true, order };
    },

    // --- التقييمات ---
    getReviews(productId) {
      const all = read(KEYS.REVIEWS, {});
      return (
        all[productId] || [
          {
            name: "Hossam",
            date: "18/10/2026",
            rating: 5,
            summary: "Awesome product!",
            text: "Great quality, fast delivery, and matches the description perfectly.",
          },
          {
            name: "Aya",
            date: "02/11/2026",
            rating: 5,
            summary: "Highly recommended",
            text: "Very clean finish and worth every penny.",
          },
        ]
      );
    },
    addReview(productId, review) {
      const all = read(KEYS.REVIEWS, {});
      const list = this.getReviews(productId);
      list.unshift({
        name: review.name || "Customer",
        date: new Date().toLocaleDateString("en-GB"),
        rating: Number(review.rating) || 5,
        summary: review.summary || "Great purchase",
        text: review.text || "",
      });
      all[productId] = list;
      write(KEYS.REVIEWS, all);
      this.toast("Thank you! Your review has been posted.");
      return list;
    },

    // --- التنقل الآمن عبر file:// ---
    setSelectedProduct(id) {
      sessionStorage.setItem(KEYS.SELECTED_PRODUCT, id);
    },
    getSelectedProduct() {
      const params = new URLSearchParams(window.location.search);
      return (
        params.get("id") ||
        sessionStorage.getItem(KEYS.SELECTED_PRODUCT) ||
        "apparel4"
      );
    },
    setNavigationFilter({ q = "", category = "" }) {
      sessionStorage.setItem(KEYS.SEARCH_QUERY, q);
      sessionStorage.setItem(KEYS.CATEGORY_FILTER, category);
    },
    getNavigationFilter() {
      const params = new URLSearchParams(window.location.search);
      return {
        q:
          params.get("q") !== null
            ? params.get("q")
            : sessionStorage.getItem(KEYS.SEARCH_QUERY) || "",
        category:
          params.get("category") !== null
            ? params.get("category")
            : sessionStorage.getItem(KEYS.CATEGORY_FILTER) || "",
      };
    },
    isPromoDismissed() {
      return read(KEYS.PROMO_DISMISSED, false);
    },
    dismissPromo() {
      write(KEYS.PROMO_DISMISSED, true);
    },

    // --- إشعارات منبثقة ---
    toast(message) {
      let container = document.getElementById("dotstore-toast-box");
      if (!container) {
        container = document.createElement("div");
        container.id = "dotstore-toast-box";
        Object.assign(container.style, {
          position: "fixed",
          bottom: "24px",
          right: "24px",
          zIndex: "99999",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          pointerEvents: "none",
        });
        document.body.appendChild(container);
      }
      const el = document.createElement("div");
      el.textContent = message;
      Object.assign(el.style, {
        background: "#0a021c",
        color: "#fff",
        padding: "12px 18px",
        borderRadius: "8px",
        fontSize: "13px",
        fontWeight: "600",
        boxShadow: "0 10px 25px rgba(0,0,0,0.22)",
        borderLeft: "4px solid #ff6b6b",
        transition: "opacity 0.3s ease, transform 0.3s ease",
      });
      container.appendChild(el);
      setTimeout(() => {
        el.style.opacity = "0";
        el.style.transform = "translateY(8px)";
        setTimeout(() => el.remove(), 320);
      }, 2500);
    },
  };
})();
