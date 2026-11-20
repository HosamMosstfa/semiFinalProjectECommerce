(() => {
  const Store = window.Store;
  const MockApi = window.MockApi;
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  function toast(message) {
    let element = $(".store-toast");
    if (!element) {
      element = document.createElement("div");
      element.className = "store-toast";
      element.setAttribute("role", "status");
      document.body.appendChild(element);
    }
    element.textContent = message;
    element.classList.add("show");
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => element.classList.remove("show"), 2600);
  }

  function copyMenu() {
    const dptCategory = $(".dpt-cat");
    const dptPlace = $(".departments");
    const mainNav = $(".header-nav nav");
    const navPlace = $(".off-canvas nav");
    const topNav = $(".header-top .wrapper");
    const topPlace = $(".off-canvas .thetop-nav");
    if (dptCategory && dptPlace) dptPlace.innerHTML = dptCategory.innerHTML;
    if (mainNav && navPlace) navPlace.innerHTML = mainNav.innerHTML;
    if (topNav && topPlace) topPlace.innerHTML = topNav.innerHTML;
  }

  function setupMenus() {
    const site = $(".site");
    $(".trigger")?.addEventListener("click", (event) => {
      event.preventDefault();
      site?.classList.toggle("showmenu");
    });
    $(".t-close")?.addEventListener("click", (event) => {
      event.preventDefault();
      site?.classList.remove("showmenu");
    });
    $$(".has-child .icon-small").forEach((icon) => {
      icon.addEventListener("click", (event) => {
        if (window.innerWidth >= 992) return;
        event.preventDefault();
        const parent = icon.closest(".has-child");
        $$(".has-child.expand").forEach((item) => item !== parent && item.classList.remove("expand"));
        parent?.classList.toggle("expand");
      });
    });
    $(".t-search")?.addEventListener("click", () => site?.classList.toggle("showsearch"));
    $(".search-close")?.addEventListener("click", () => site?.classList.remove("showsearch"));
    $(".dpt-cat .dpt-trigger")?.addEventListener("click", (event) => {
      event.preventDefault();
      site?.classList.toggle("showdpt");
    });
  }

  function setupThemeControl() {
    const nav = $(".header-nav .second-links");
    if (nav && !$("[data-theme-toggle]", nav)) {
      const item = document.createElement("li");
      item.className = "theme-control";
      item.innerHTML = `<a href="#" data-theme-toggle aria-label="Toggle color theme"><i class="ri-moon-line"></i></a>`;
      nav.prepend(item);
      item.addEventListener("click", (event) => {
        event.preventDefault();
        window.Theme?.toggle();
      });
    }
  }

  function setupSliders() {
    if (typeof Swiper === "undefined") return;
    if ($(".swiper")) new Swiper(".swiper", { loop: true, pagination: { el: ".swiper-pagination" } });
    if ($(".small-image") && $(".big-image")) {
      const thumbs = new Swiper(".small-image", {
        loop: true, spaceBetween: 10, slidesPerView: 3, freeMode: true, watchSlidesProgress: true,
        breakpoints: { 481: { spaceBetween: 32 } }
      });
      new Swiper(".big-image", {
        loop: true, autoHeight: true,
        navigation: { nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" },
        thumbs: { swiper: thumbs }
      });
    }
  }

  function setupStocks() {
    $$(".products .stock").forEach((stock) => {
      const sold = Number($(".qty-sold", stock)?.textContent.replace(/,/g, "")) || 0;
      const total = Number(stock.dataset.stock) || 1;
      if ($(".available", stock)) $(".available", stock).style.width = `${Math.min(100, sold * 100 / total)}%`;
    });
  }

  function setupModal() {
    if ($(".modal")) setTimeout(() => $(".site")?.classList.add("showmodal"), 500);
    $(".modalclose")?.addEventListener("click", () => $(".site")?.classList.remove("showmodal"));
  }

  function renderMiniCart() {
    const state = Store.getState();
    const count = state.cart.reduce((sum, item) => sum + item.quantity, 0);
    $$(".iscart").forEach((cart) => {
      $$(".item-number", cart).forEach((badge) => badge.textContent = count);
      $$(".cart-total", cart).forEach((total) => total.textContent = Store.money(state.totals.subtotal));
      $$(".cart-head", cart).forEach((head) => head.textContent = `${count} item${count === 1 ? "" : "s"} in cart`);
      $$(".subtotal p:last-child strong", cart).forEach((subtotal) => subtotal.textContent = Store.money(state.totals.subtotal));
      const list = $(".cart-body ul", cart);
      if (list) {
        list.innerHTML = state.cart.length ? state.cart.map((item) => `
          <li class="item" data-id="${item.id}">
            <div class="thumbnail object-cover"><a href="product.html?id=${item.id}"><img src="${item.image}" alt="${item.name}" /></a></div>
            <div class="item-content"><p><a href="product.html?id=${item.id}">${item.name}</a></p>
              <span class="price"><span>${Store.money(item.price)}</span><span class="fly-item"><span>${item.quantity}x</span></span></span>
            </div>
            <a href="#" class="item-remove" aria-label="Remove ${item.name}"><i class="ri-close-line"></i></a>
          </li>`).join("") : `<li class="item"><p>Your cart is empty</p></li>`;
      }
    });
  }

  function renderCartPage() {
    const table = $("#cart-table tbody");
    if (!table) return;
    const cart = Store.getCart();
    table.innerHTML = cart.length ? cart.map((item) => `
      <tr data-id="${item.id}">
        <td class="flexitem">
          <div class="thumbnail object-cover"><a href="product.html?id=${item.id}"><img src="${item.image}" alt="${item.name}" /></a></div>
          <div class="content"><strong><a href="product.html?id=${item.id}">${item.name}</a></strong></div>
        </td>
        <td>${Store.money(item.price)}</td>
        <td><div class="qty-control flexitem">
          <button type="button" class="minus">-</button>
          <input type="number" value="${item.quantity}" min="1" aria-label="Quantity for ${item.name}" />
          <button type="button" class="plus">+</button>
        </div></td>
        <td class="line-subtotal">${Store.money(item.price * item.quantity)}</td>
        <td><a href="#" class="item-remove" aria-label="Remove ${item.name}"><i class="ri-close-line"></i></a></td>
      </tr>`).join("") : `<tr><td colspan="5" class="empty-cart">Your cart is empty. <a href="page-category.html">Continue shopping</a></td></tr>`;
    updateCartTotals();
  }

  function updateCartTotals() {
    const totals = Store.totals();
    const subtotalRow = $(".cart-total table tr:not(.grand-total)");
    $$(".cart-total table tbody tr").forEach((row) => {
      const label = $("th", row)?.textContent.toLowerCase() || "";
      if (label.includes("subtotal")) row.querySelector("td").textContent = Store.money(totals.subtotal);
      if (label.includes("discount")) row.querySelector("td").textContent = Store.money(totals.discount);
      if (label.includes("shipping")) row.querySelector("td").textContent = Store.money(totals.shipping);
      if (row.classList.contains("grand-total")) row.querySelector("strong").textContent = Store.money(totals.total);
    });
    const summaryRows = $$(".summary-totals li");
    if (summaryRows[0]) summaryRows[0].lastElementChild.textContent = Store.money(totals.subtotal);
    if (summaryRows[1]) summaryRows[1].lastElementChild.textContent = `-${Store.money(totals.discount)}`;
    if (summaryRows[2]) summaryRows[2].lastElementChild.textContent = Store.money(totals.shipping);
    if (summaryRows[3]) summaryRows[3].querySelector("strong").textContent = Store.money(totals.total);
  }

  function setupCart() {
    document.addEventListener("click", (event) => {
      const remove = event.target.closest(".item-remove");
      if (!remove) return;
      event.preventDefault();
      const item = remove.closest("[data-id]");
      if (item) {
        Store.removeFromCart(item.dataset.id);
        toast("Item removed from cart");
      }
    });

    $("#cart-table")?.addEventListener("click", (event) => {
      const button = event.target.closest(".minus, .plus");
      if (!button) return;
      event.preventDefault();
      const row = button.closest("tr");
      const input = $("input[type='number']", row);
      if (!row || !input) return;
      const quantity = Math.max(1, (Number(input.value) || 1) + (button.classList.contains("plus") ? 1 : -1));
      Store.setQuantity(row.dataset.id, quantity);
      toast("Cart updated");
    });
    $("#cart-table")?.addEventListener("change", (event) => {
      if (!event.target.matches("input[type='number']")) return;
      const row = event.target.closest("tr");
      Store.setQuantity(row.dataset.id, event.target.value);
      toast("Cart updated");
    });

    $(".cart-summary .coupon button")?.addEventListener("click", (event) => {
      event.preventDefault();
      const code = $(".cart-summary .coupon input")?.value;
      toast(Store.applyCoupon(code) ? "Coupon applied" : "Invalid coupon code");
    });
    $$('input[name="rate-option"]').forEach((radio) => {
      radio.addEventListener("change", () => Store.setShipping(radio.id === "best" ? 0 : 10));
    });
  }

  function setupCartPopup() {
    $$(".iscart > a").forEach((link) => {
      link.addEventListener("click", (event) => {
        event.preventDefault();
        const popup = link.closest(".iscart")?.querySelector(".mini-cart");
        popup?.classList.toggle("show");
      });
    });
    $(".cart-trigger")?.addEventListener("click", (event) => {
      event.preventDefault();
      $(".mini-cart")?.classList.toggle("show");
    });
    document.addEventListener("click", (event) => {
      if (!event.target.closest(".mini-cart") && !event.target.closest(".iscart")) {
        $$(".mini-cart.show").forEach((popup) => popup.classList.remove("show"));
      }
    });
  }

  function setupAddToCart() {
    document.addEventListener("click", (event) => {
      const button = event.target.closest(".button-cart button");
      if (button) {
        event.preventDefault();
        const item = button.closest(".item");
        const name = $("h1, h3", item)?.textContent.trim();
        const image = $("img", item)?.getAttribute("src");
        const priceText = $(".current", item)?.textContent || $(".price span", item)?.textContent;
        const price = Number(priceText?.replace(/[^0-9.]/g, ""));
        if (name && image && price) {
          const id = `product-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`;
          Store.addToCart({ id, name, price, image }, 1);
          toast(`${name} added to cart`);
        }
      }
    });

    $$(".products.main .item").forEach((item) => {
      const hoverable = $(".hoverable", item);
      if (!hoverable || $(".add-cart-action", hoverable)) return;
      const link = document.createElement("li");
      link.className = "add-cart-action";
      link.innerHTML = `<a href="#" aria-label="Add to cart"><i class="ri-shopping-bag-line"></i></a>`;
      $("ul", hoverable)?.appendChild(link);
      link.addEventListener("click", (event) => {
        event.preventDefault();
        const name = $("h3", item)?.textContent.trim();
        const image = $("img", item)?.getAttribute("src");
        const price = Number($(".current", item)?.textContent.replace(/[^0-9.]/g, ""));
        if (name && image && price) {
          const id = `product-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`;
          Store.addToCart({ id, name, price, image }, 1);
          toast(`${name} added to cart`);
        }
      });
    });
  }

  function setupSearch() {
    $$("form.search").forEach((form) => {
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        const input = $("input[type='search'], input[type='text'], input[type='mail'], input[type='email']", form);
        if (!input) return;
        if (input.type === "email" || input.type === "mail") {
          if (input.reportValidity()) {
            toast("Thanks! You are subscribed.");
            form.reset();
          }
          return;
        }
        const query = input.value.trim();
        if (query) window.location.href = `page-category.html?q=${encodeURIComponent(query)}`;
        else input.focus();
      });
    });
  }

  async function setupCategoryPage() {
    const container = $(".products.main");
    if (!container) return;
    const params = new URLSearchParams(window.location.search);
    const query = params.get("q");
    const category = params.get("category");
    const renderCatalog = async (filters = {}) => {
      const products = await MockApi.getProducts({ q: query, category, ...filters });
      if (!products.length) {
        container.innerHTML = `<div class="empty-cart">No products match your search.</div>`;
        return;
      }
      container.innerHTML = products.map((product) => `
        <div class="item" data-id="${product.id}" data-category="${product.category}">
          <div class="media">
            <div class="thumbnail object-cover"><a href="product.html?id=${product.id}"><img src="${product.image}" alt="${product.name}" /></a></div>
            <div class="hoverable"><ul>
              <li class="active wishlist-action"><a href="#" aria-label="Add ${product.name} to wishlist"><i class="ri-heart-line"></i></a></li>
              <li><a href="product.html?id=${product.id}" aria-label="View ${product.name}"><i class="ri-eye-line"></i></a></li>
              <li class="add-cart-action"><a href="#" aria-label="Add ${product.name} to cart"><i class="ri-shopping-bag-line"></i></a></li>
            </ul></div>
            ${product.oldPrice ? `<div class="discount circle flexcenter"><span>${Math.round((1 - product.price / product.oldPrice) * 100)}%</span></div>` : ""}
          </div>
          <div class="content">
            <div class="rating"><div class="stars"></div><span class="mini-text">(verified)</span></div>
            <h3 class="main-links"><a href="product.html?id=${product.id}">${product.name}</a></h3>
            <div class="price"><span class="current">${Store.money(product.price)}</span><span class="normal mini-text">${Store.money(product.oldPrice)}</span></div>
            <div class="footer"><ul class="mini-text"><li>${product.category}</li><li>${product.stock} available</li></ul></div>
          </div>
        </div>`).join("");
    };

    await renderCatalog();

    let sort = $(".cat-sort");
    if (!sort) {
      sort = document.createElement("select");
      sort.className = "cat-sort";
      sort.setAttribute("aria-label", "Sort products");
      sort.innerHTML = `<option value="">Featured</option><option value="low">Price: Low to high</option><option value="high">Price: High to low</option><option value="name">Name</option>`;
      $(".cat-head")?.appendChild(sort);
    }
    sort.addEventListener("change", () => renderCatalog({ sort: sort.value }));

    $$(".filter input[type='checkbox']").forEach((input) => {
      input.addEventListener("change", () => {
        const selected = $$(".filter input[type='checkbox']:checked").map((item) => item.labels?.[0]?.textContent.trim()).filter(Boolean);
        container.querySelectorAll(".item").forEach((item) => {
          const text = item.textContent.toLowerCase();
          item.hidden = selected.length > 0 && !selected.some((label) => text.includes(label.toLowerCase()));
        });
      });
    });

    container.addEventListener("click", (event) => {
      const cartLink = event.target.closest(".add-cart-action a");
      if (cartLink) {
        event.preventDefault();
        const item = cartLink.closest(".item");
        MockApi.getProduct(item.dataset.id).then((product) => {
          if (product) {
            Store.addToCart(product, 1);
            toast(`${product.name} added to cart`);
          }
        });
      }
      const wishlistLink = event.target.closest(".wishlist-action a");
      if (wishlistLink) {
        event.preventDefault();
        const item = wishlistLink.closest(".item");
        const added = Store.toggleWishlist(item.dataset.id);
        toast(added ? "Added to wishlist" : "Removed from wishlist");
      }
    });
  }

  async function setupProductLinks() {
    $$("a").forEach((link) => {
      const href = link.getAttribute("href");
      if (href === "/" || href === "/index.html") link.setAttribute("href", "index.html");
    });
    if (!MockApi) return;
    const products = await MockApi.getProducts();
    $$(".products.main .item, .products .item").forEach((item) => {
      const name = $("h3, h1", item)?.textContent.trim();
      const product = name && products.find((candidate) =>
        name.toLowerCase().includes(candidate.name.toLowerCase().slice(0, 12)) ||
        candidate.name.toLowerCase().includes(name.toLowerCase().slice(0, 12))
      );
      if (!product) return;
      $$("a", item).forEach((link) => {
        const href = link.getAttribute("href");
        if (!href || href === "#" || href === "" ) link.setAttribute("href", `product.html?id=${product.id}`);
      });
    });
  }

  async function setupProductPage() {
    const mount = $("#product-page");
    if (!mount) return;
    const id = new URLSearchParams(window.location.search).get("id");
    const product = id ? await MockApi.getProduct(id) : null;
    if (!product) {
      mount.innerHTML = `<div class="empty-cart"><h1>Product not found</h1><a href="page-category.html">Browse products</a></div>`;
      return;
    }
    document.title = `${product.name} - Store`;
    mount.innerHTML = `
      <div class="container">
        <div class="breadcrumb"><ul class="flexitem"><li><a href="index.html">Home</a></li><li><a href="page-category.html">Shop</a></li><li>${product.name}</li></ul></div>
        <div class="flexwrap product-detail">
          <div class="item product-media"><div class="thumbnail"><img src="${product.image}" alt="${product.name}" /></div></div>
          <div class="item product-content">
            <span class="mini-text">${product.category}</span>
            <h1>${product.name}</h1>
            <div class="price"><span class="current">${Store.money(product.price)}</span><span class="normal mini-text">${Store.money(product.oldPrice)}</span></div>
            <p>${product.description}</p>
            <p class="stock-status">${product.stock > 0 ? "In stock" : "Out of stock"} — ${product.stock} available</p>
            <div class="actions">
              <div class="qty-control flexitem"><button type="button" class="minus circle">-</button><input type="number" value="1" min="1" max="${product.stock}" /><button type="button" class="plus circle">+</button></div>
              <div class="button-cart"><button type="button" class="primary-button" ${product.stock ? "" : "disabled"}>Add to cart</button></div>
              <button type="button" class="secondary-button wish-button">Add to wishlist</button>
            </div>
          </div>
        </div>
      </div>`;

    const quantity = $("input[type='number']", mount);
    $(".minus", mount)?.addEventListener("click", () => quantity.value = Math.max(1, Number(quantity.value) - 1));
    $(".plus", mount)?.addEventListener("click", () => quantity.value = Math.min(product.stock, Number(quantity.value) + 1));
    $(".button-cart button", mount)?.addEventListener("click", () => {
      Store.addToCart(product, quantity.value);
      toast(`${product.name} added to cart`);
    });
    $(".wish-button", mount)?.addEventListener("click", (event) => {
      const added = Store.toggleWishlist(product.id);
      event.currentTarget.textContent = added ? "Remove from wishlist" : "Add to wishlist";
      toast(added ? "Added to wishlist" : "Removed from wishlist");
    });
  }

  function setupCheckout() {
    const form = $(".checkout .left form");
    const button = $(".primary-checkout .primary-button");
    if (!form || !button) return;
    $$('.shipping-methods input[type="radio"], input[name="rate-option"]').forEach((radio) => {
      radio.addEventListener("change", () => {
        Store.setShipping(radio.id === "best" ? 0 : radio.id === "flat" ? 10 : 10);
      });
    });
    button.addEventListener("click", (event) => {
      event.preventDefault();
      if (!Store.getCart().length) {
        toast("Your cart is empty");
        return;
      }
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      const customer = Object.fromEntries(new FormData(form).entries());
      const order = Store.placeOrder(customer);
      toast(`Order ${order.id} placed successfully`);
      setTimeout(() => window.location.href = "index.html", 1600);
    });
  }

  function setupSignIn() {
    const signUp = $(".sign-up1 form");
    const signIn = $(".sign-in1 form");
    signUp?.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!signUp.checkValidity()) return signUp.reportValidity();
      const [name, email, password] = $$("input", signUp).map((input) => input.value);
      Store.createAccount({ name, email, password });
      toast("Account created successfully");
      $("#container1")?.classList.remove("active1");
    });
    signIn?.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!signIn.checkValidity()) return signIn.reportValidity();
      const [email, password] = $$("input", signIn).map((input) => input.value);
      if (!Store.login(email, password)) {
        toast("Email or password is incorrect");
        return;
      }
      window.location.href = "index.html";
    });
  }

  function setupWishlist() {
    const wishlist = Store.getWishlist();
    $$(".ri-heart-line").forEach((icon) => {
      const badge = $(".item-number", icon.closest("a") || document);
      if (badge) badge.textContent = wishlist.length;
    });
    $$(".ri-heart-line").forEach((icon) => {
      const link = icon.closest("a");
      if (link && !link.closest(".iscart") && !link.closest(".hoverable")) link.setAttribute("href", "wishlist.html");
    });
  }

  function setupWishlistPage() {
    const mount = $("#wishlist-page");
    if (!mount) return;
    const render = async () => {
      const wishlist = Store.getWishlist();
      const products = await Promise.all(wishlist.map((id) => MockApi.getProduct(id)));
      const found = products.filter(Boolean);
      mount.innerHTML = found.length ? `
        <div class="container"><div class="page-title"><h1>My Wishlist</h1></div>
          <div class="products main flexwrap">${found.map((product) => `
            <div class="item" data-id="${product.id}">
              <div class="media"><div class="thumbnail object-cover"><a href="product.html?id=${product.id}"><img src="${product.image}" alt="${product.name}" /></a></div></div>
              <div class="content"><h3><a href="product.html?id=${product.id}">${product.name}</a></h3>
                <div class="price"><span class="current">${Store.money(product.price)}</span></div>
                <button type="button" class="primary-button wishlist-cart">Add to cart</button>
                <button type="button" class="secondary-button wishlist-remove">Remove</button>
              </div>
            </div>`).join("")}</div>
        </div>` : `<div class="container"><div class="empty-cart"><h1>My Wishlist</h1><p>Your wishlist is empty.</p><a href="page-category.html" class="secondary-button">Browse products</a></div></div>`;
    };
    render();
    Store.subscribe(render);
    mount.addEventListener("click", (event) => {
      const item = event.target.closest(".item");
      if (!item) return;
      MockApi.getProduct(item.dataset.id).then((product) => {
        if (!product) return;
        if (event.target.closest(".wishlist-cart")) {
          Store.addToCart(product, 1);
          toast(`${product.name} added to cart`);
        }
        if (event.target.closest(".wishlist-remove")) Store.toggleWishlist(product.id);
      });
    });
  }

  function setupAccountPage() {
    const mount = $("#account-page");
    if (!mount) return;
    const session = Store.getSession();
    if (!session) {
      mount.innerHTML = `<div class="container"><div class="empty-cart"><h1>Account</h1><p>Please sign in to view account details.</p><a href="sign-in.html" class="primary-button">Sign in</a></div></div>`;
      return;
    }
    const orders = Store.getOrders();
    mount.innerHTML = `
      <div class="container">
        <div class="page-title"><h1>My Account</h1></div>
        <div class="account-grid">
          <section><h2>Profile</h2><p><strong>Name:</strong> ${session.name || "Customer"}</p><p><strong>Email:</strong> ${session.email}</p><button type="button" class="secondary-button" id="logout-account">Log out</button></section>
          <section><h2>Recent Orders</h2>${orders.length ? orders.map((order) => `<article class="order-card"><strong>${order.id}</strong><p>${new Date(order.date).toLocaleDateString()}</p><p>${order.items.length} items — ${Store.money(order.totals.total)}</p></article>`).join("") : `<p>No orders yet.</p>`}</section>
        </div>
      </div>`;
    $("#logout-account")?.addEventListener("click", () => {
      Store.logout();
      window.location.href = "index.html";
    });
  }

  function setupBackToTop() {
    $(".backtotop a")?.addEventListener("click", (event) => {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  function setupAccountLinks() {
    $$("a").forEach((link) => {
      if (link.textContent.trim() === "My Account") link.setAttribute("href", "account.html");
      if (link.textContent.trim() === "Wishlist") link.setAttribute("href", "wishlist.html");
    });
  }

  copyMenu();
  setupMenus();
  setupThemeControl();
  setupSliders();
  setupStocks();
  setupModal();
  renderMiniCart();
  renderCartPage();
  setupCart();
  setupCartPopup();
  setupAddToCart();
  setupSearch();
  setupProductLinks();
  setupProductPage();
  setupCategoryPage();
  setupCheckout();
  setupSignIn();
  setupWishlist();
  setupWishlistPage();
  setupAccountPage();
  setupAccountLinks();
  setupBackToTop();

  Store.subscribe(() => {
    renderMiniCart();
    renderCartPage();
    updateCartTotals();
  });
})();
