(() => {
  const KEYS = {
    cart: "eraasoft_cart",
    wishlist: "eraasoft_wishlist",
    coupon: "eraasoft_coupon",
    shipping: "eraasoft_shipping",
    account: "eraasoft_account",
    session: "eraasoft_session",
    orders: "eraasoft_orders"
  };

  const read = (key, fallback) => {
    try {
      const value = JSON.parse(localStorage.getItem(key));
      return value ?? fallback;
    } catch {
      return fallback;
    }
  };
  const write = (key, value) => localStorage.setItem(key, JSON.stringify(value));
  const money = (value) => `$${Number(value).toFixed(2)}`;
  let listeners = [];

  const Store = {
    read,
    write,
    money,
    getCart: () => read(KEYS.cart, []),
    setCart: (cart) => {
      write(KEYS.cart, cart);
      listeners.forEach((listener) => listener(Store.getState()));
    },
    addToCart(product, quantity = 1) {
      const cart = Store.getCart();
      const existing = cart.find((item) => item.id === product.id);
      if (existing) existing.quantity += Math.max(1, Number(quantity));
      else cart.push({ ...product, quantity: Math.max(1, Number(quantity)) });
      Store.setCart(cart);
    },
    setQuantity(id, quantity) {
      const cart = Store.getCart();
      const item = cart.find((product) => product.id === id);
      if (!item) return;
      item.quantity = Math.max(1, Number(quantity) || 1);
      Store.setCart(cart);
    },
    removeFromCart(id) {
      Store.setCart(Store.getCart().filter((item) => item.id !== id));
    },
    clearCart: () => Store.setCart([]),
    getWishlist: () => read(KEYS.wishlist, []),
    toggleWishlist(id) {
      const wishlist = Store.getWishlist();
      const index = wishlist.indexOf(id);
      if (index >= 0) wishlist.splice(index, 1);
      else wishlist.push(id);
      write(KEYS.wishlist, wishlist);
      listeners.forEach((listener) => listener(Store.getState()));
      return index < 0;
    },
    getCoupon: () => read(KEYS.coupon, { code: "", discount: 0, type: "none" }),
    applyCoupon(code) {
      const normalized = String(code).trim().toUpperCase();
      if (normalized === "SAVE10") write(KEYS.coupon, { code: normalized, discount: 0.10, type: "percent" });
      else if (normalized === "SAVE100") write(KEYS.coupon, { code: normalized, discount: 100, type: "fixed" });
      else {
        write(KEYS.coupon, { code: "", discount: 0, type: "none" });
        return false;
      }
      listeners.forEach((listener) => listener(Store.getState()));
      return true;
    },
    clearCoupon: () => write(KEYS.coupon, { code: "", discount: 0, type: "none" }),
    subtotal() {
      return Store.getCart().reduce((sum, item) => sum + item.price * item.quantity, 0);
    },
    setShipping(shipping) {
      write(KEYS.shipping, Number(shipping));
      listeners.forEach((listener) => listener(Store.getState()));
    },
    getShipping: () => read(KEYS.shipping, 10),
    totals(shipping = Store.getShipping()) {
      const subtotal = Store.subtotal();
      const coupon = Store.getCoupon();
      const discount = coupon.type === "fixed"
        ? Math.min(subtotal, coupon.discount)
        : coupon.type === "percent" ? subtotal * coupon.discount : 0;
      return { subtotal, discount, shipping: Store.getCart().length ? shipping : 0, total: Math.max(0, subtotal - discount + (Store.getCart().length ? shipping : 0)) };
    },
    createAccount(account) {
      write(KEYS.account, account);
      write(KEYS.session, { email: account.email, name: account.name });
      listeners.forEach((listener) => listener(Store.getState()));
    },
    login(email, password) {
      const account = read(KEYS.account, null);
      if (account && account.email === email && account.password === password) {
        write(KEYS.session, { email: account.email, name: account.name });
        listeners.forEach((listener) => listener(Store.getState()));
        return true;
      }
      if (!account && email && password) {
        write(KEYS.session, { email, name: email.split("@")[0] });
        listeners.forEach((listener) => listener(Store.getState()));
        return true;
      }
      return false;
    },
    logout() {
      localStorage.removeItem(KEYS.session);
      listeners.forEach((listener) => listener(Store.getState()));
    },
    getSession: () => read(KEYS.session, null),
    placeOrder(customer) {
      if (!Store.getCart().length) return null;
      const totals = Store.totals();
      const order = {
        id: `ORD-${Date.now().toString().slice(-8)}`,
        date: new Date().toISOString(),
        items: Store.getCart(),
        totals,
        customer
      };
      const orders = read(KEYS.orders, []);
      orders.unshift(order);
      write(KEYS.orders, orders);
      Store.clearCart();
      Store.clearCoupon();
      return order;
    },
    getOrders: () => read(KEYS.orders, []),
    getState: () => ({
      cart: Store.getCart(),
      wishlist: Store.getWishlist(),
      coupon: Store.getCoupon(),
      session: Store.getSession(),
      totals: Store.totals()
    }),
    subscribe(listener) {
      listeners.push(listener);
      return () => { listeners = listeners.filter((item) => item !== listener); };
    }
  };

  window.Store = Store;
})();
