(function () {
  function escapeHtml(str) {
    return String(str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function openProduct(id) {
    window.Store.setSelectedProduct(id);
    window.location.href = `product.html?id=${encodeURIComponent(id)}`;
  }

  function goToShop({ q = "", category = "" } = {}) {
    window.Store.setNavigationFilter({ q, category });
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (category) params.set("category", category);
    const qs = params.toString();
    window.location.href = `page-category.html${qs ? "?" + qs : ""}`;
  }

  // 0. توحيد الهيدر والفوتر وعناصر الموبايل في أي صفحة ناقصة
  function ensureUnifiedChrome() {
    const pageEl = document.getElementById("page");
    if (!pageEl) return;

    // إصلاح خطأ .righ المتكرر أو المفرد في القالب
    document.querySelectorAll(".righ").forEach((el) => {
      el.classList.remove("righ");
      el.classList.add("right");
    });

    // إضافة aside.site-off للموبايل إن لم يكن موجودًا
    if (!pageEl.querySelector("aside.site-off")) {
      const aside = document.createElement("aside");
      aside.className = "site-off desktop-hide";
      aside.innerHTML = `
        <div class="off-canvas">
          <div class="canvas-head flexitem">
            <div class="logo"><a href="index.html"><span class="circle"></span>.store</a></div>
            <a href="#" class="t-close flexcenter"><i class="ri-close-line"></i></a>
          </div>
          <div class="departments"></div>
          <nav></nav>
          <div class="thetop-nav"></div>
        </div>`;
      pageEl.prepend(aside);
    }

    // حقن header-top + header-main + trigger في الصفحات ذات الهيدر المختصر
    const header = pageEl.querySelector("header");
    if (header && !header.querySelector(".header-top")) {
      const topBar = document.createElement("div");
      topBar.className = "header-top mobile-hide";
      topBar.innerHTML = `
        <div class="container">
          <div class="wrapper flexitem">
            <div class="left">
              <ul class="flexitem main-links">
                <li><a href="page-category.html">Featured products</a></li>
                <li><a href="wishlist.html">Wishlist</a></li>
                <li><a href="page-offer.html">Hot Offer</a></li>
              </ul>
            </div>
            <div class="right">
              <ul class="flexitem main-links">
                <li><a href="sign-in.html">Sign Up</a></li>
                <li><a href="account.html">My Account</a></li>
                <li><a href="account.html?tab=orders">Order Tracking</a></li>
                <li>
                  <a href="#">USD <span class="icon-small"><i class="ri-arrow-down-s-line"></i></span></a>
                  <ul>
                    <li class="current"><a href="#">USD</a></li>
                    <li><a href="#">EURO</a></li>
                    <li><a href="#">GBP</a></li>
                    <li><a href="#">IDR</a></li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </div>`;
      header.prepend(topBar);
    }

    const navWrapper = header?.querySelector(".header-nav .wrapper");
    if (navWrapper && !navWrapper.querySelector(".trigger")) {
      const trig = document.createElement("a");
      trig.href = "#";
      trig.className = "trigger desktop-hide";
      trig.innerHTML = `<span class="i ri-menu-2-line"></span>`;
      navWrapper.prepend(trig);
    }

    if (header && !header.querySelector(".header-main")) {
      const mainBar = document.createElement("div");
      mainBar.className = "header-main mobile-hide";
      mainBar.innerHTML = `
        <div class="container">
          <div class="wrapper flexitem">
            <div class="left">
              <div class="dpt-cat">
                <div class="dpt-head">
                  <div class="main-text">All Departments</div>
                  <div class="mini-text mobile-hide">Total 18 products</div>
                  <a href="#" class="dpt-trigger mobile-hide">
                    <i class="ri-menu-3-line ri-xl"></i>
                    <i class="ri-close-line ri-xl"></i>
                  </a>
                </div>
                <div class="dpt-menu">
                  <ul class="second-links">
                    <li><a href="page-category.html?category=Electronic"><div class="icon-large"><i class="ri-bluetooth-connect-line"></i></div>Electronic</a></li>
                    <li><a href="page-category.html?category=Women"><div class="icon-large"><i class="ri-t-shirt-air-line"></i></div>Women's Fashion</a></li>
                    <li><a href="page-category.html?category=Men"><div class="icon-large"><i class="ri-shirt-line"></i></div>Men's Fashion</a></li>
                    <li><a href="page-category.html?category=Home"><div class="icon-large"><i class="ri-home-8-line"></i></div>Home & Kitchen</a></li>
                    <li><a href="page-category.html?category=Sports"><div class="icon-large"><i class="ri-basketball-line"></i></div>Sports</a></li>
                  </ul>
                </div>
              </div>
            </div>
            <div class="right">
              <div class="search-box">
                <form action="" class="search">
                  <span class="icon-large"><i class="ri-search-line"></i></span>
                  <input type="search" placeholder="Search for products" />
                  <button type="submit">Search</button>
                </form>
              </div>
            </div>
          </div>
        </div>`;
      header.appendChild(mainBar);
    }

    // حقن الفوتر الموحد في الصفحات التي لا تحتوي على footer
    if (!pageEl.querySelector("footer")) {
      const footer = document.createElement("footer");
      footer.innerHTML = `
        <div class="newsletter">
          <div class="container">
            <div class="wrapper">
              <div class="box">
                <div class="content">
                  <h3>Join Our Newsletter</h3>
                  <p>Get E-mail Updates about our latest shop and <strong>Special Offers</strong></p>
                </div>
                <form action="" class="search">
                  <span class="icon-large"><i class="ri-mail-line"></i></span>
                  <input type="email" placeholder="Your email address" required />
                  <button type="submit">Sign Up</button>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div class="widgets">
          <div class="container">
            <div class="wrapper">
              <div class="flexwrap">
                <div class="row"><div class="item mini-links"><h4>Help & Contact</h4><ul class="flexcol"><li><a href="account.html">Your Account</a></li><li><a href="account.html?tab=orders">Your Orders</a></li><li><a href="cart.html">Shipping Rates</a></li><li><a href="wishlist.html">Wishlist</a></li></ul></div></div>
                <div class="row"><div class="item mini-links"><h4>Product Categories</h4><ul class="flexcol"><li><a href="page-category.html?category=Electronic">Electronic</a></li><li><a href="page-category.html?category=Women">Women's Fashion</a></li><li><a href="page-category.html?category=Men">Men's Fashion</a></li><li><a href="page-category.html?category=Home">Home & Kitchen</a></li><li><a href="page-category.html?category=Sports">Sports</a></li></ul></div></div>
                <div class="row"><div class="item mini-links"><h4>Quick Links</h4><ul class="flexcol"><li><a href="index.html">Home</a></li><li><a href="page-category.html">Shop All</a></li><li><a href="page-offer.html">Daily Offer</a></li><li><a href="checkout.html">Checkout</a></li></ul></div></div>
              </div>
            </div>
          </div>
        </div>
        <div class="footer-info">
          <div class="container">
            <div class="wrapper">
              <div class="flexcol">
                <div class="logo"><a href="index.html"><span class="circle"></span>.store</a></div>
                <div class="socials">
                  <ul class="flexitem">
                    <li><a href="index.html"><i class="ri-twitter-line"></i></a></li>
                    <li><a href="index.html"><i class="ri-facebook-line"></i></a></li>
                    <li><a href="index.html"><i class="ri-instagram-line"></i></a></li>
                    <li><a href="index.html"><i class="ri-linkedin-line"></i></a></li>
                  </ul>
                </div>
              </div>
              <p class="mini-text">Copyright 2026 © .store All rights reserved</p>
            </div>
          </div>
        </div>`;
      pageEl.appendChild(footer);
    }

    // حقن قائمة الموبايل السفلية وزر العودة للأعلى إن لم يكونا موجودين
    if (!pageEl.querySelector(".menu-bottom")) {
      const mb = document.createElement("div");
      mb.className = "menu-bottom desktop-hide";
      mb.innerHTML = `
        <div class="container"><div class="wrapper"><nav><ul class="flexitem">
          <li><a href="index.html"><i class="ri-home-5-line"></i><span>Home</span></a></li>
          <li><a href="account.html"><i class="ri-user-6-line"></i><span>Account</span></a></li>
          <li><a href="wishlist.html"><i class="ri-heart-line"></i><span>Wishlist</span></a></li>
          <li><a href="#0" class="t-search"><i class="ri-search-line"></i><span>Search</span></a></li>
          <li><a href="cart.html"><i class="ri-shopping-cart-line"></i><span>Cart</span><div class="fly-item"><span class="item-number">0</span></div></a></li>
        </ul></nav></div></div>`;
      pageEl.appendChild(mb);
    }

    if (!pageEl.querySelector(".search-bottom")) {
      const sb = document.createElement("div");
      sb.className = "search-bottom desktop-hide";
      sb.innerHTML = `
        <div class="container"><div class="wrapper">
          <form action="" class="search">
            <a href="#" class="t-close search-close flexcenter"><i class="ri-close-line"></i></a>
            <span class="icon-large"><i class="ri-search-line"></i></span>
            <input type="search" placeholder="Search for products" required />
            <button type="submit">Search</button>
          </form>
        </div></div>`;
      pageEl.appendChild(sb);
    }

    if (!pageEl.querySelector(".backtotop")) {
      const btt = document.createElement("div");
      btt.className = "backtotop";
      btt.innerHTML = `<a href="#" class="flexcol"><i class="ri-arrow-up-line"></i><span>Top</span></a>`;
      pageEl.appendChild(btt);
    }

    if (!pageEl.querySelector(".overlay")) {
      const ov = document.createElement("div");
      ov.className = "overlay";
      pageEl.appendChild(ov);
    }
  }

  // 1. تفاعلات القالب (القائمة الجانبية، السلايدر، الأكورديون، المودال الترويجي)
  function initTemplateInteractions() {
    const dptCat = document.querySelector(".dpt-cat .dpt-menu");
    const dptPlace = document.querySelector(".off-canvas .departments");
    if (dptCat && dptPlace && !dptPlace.innerHTML.trim()) {
      dptPlace.innerHTML = dptCat.innerHTML;
    }

    const mainNav = document.querySelector(".header-nav nav");
    const navPlace = document.querySelector(".off-canvas nav");
    if (mainNav && navPlace && !navPlace.innerHTML.trim()) {
      navPlace.innerHTML = mainNav.innerHTML;
    }

    const topNav = document.querySelector(".header-top .wrapper");
    const topPlace = document.querySelector(".off-canvas .thetop-nav");
    if (topNav && topPlace && !topPlace.innerHTML.trim()) {
      topPlace.innerHTML = topNav.innerHTML;
    }

    const menuButton = document.querySelector(".trigger");
    const closeButton = document.querySelector(".off-canvas .t-close");
    const overlay = document.querySelector(".overlay");
    const siteEl = document.querySelector(".site");

    if (menuButton && siteEl) {
      menuButton.addEventListener("click", (e) => {
        e.preventDefault();
        siteEl.classList.toggle("showmenu");
      });
    }
    if (closeButton && siteEl) {
      closeButton.addEventListener("click", (e) => {
        e.preventDefault();
        siteEl.classList.remove("showmenu");
      });
    }
    if (overlay && siteEl) {
      overlay.addEventListener("click", () => {
        siteEl.classList.remove("showmenu");
        siteEl.classList.remove("showmodal");
      });
    }

    // قوائم الموبايل الفرعية
    document.querySelectorAll(".off-canvas .has-child > a").forEach((link) => {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        const parent = this.closest(".has-child");
        document.querySelectorAll(".off-canvas .has-child").forEach((el) => {
          if (el !== parent) el.classList.remove("expand");
        });
        parent.classList.toggle("expand");
      });
    });

    // زر All Departments
    const dptButton = document.querySelector(".dpt-cat .dpt-trigger");
    if (dptButton && siteEl) {
      dptButton.addEventListener("click", (e) => {
        e.preventDefault();
        siteEl.classList.toggle("showdpt");
      });
    }

    // بحث الموبايل السفلي
    const searchBtn = document.querySelector(".t-search");
    const searchClose = document.querySelector(".search-close");
    if (searchBtn && siteEl) {
      searchBtn.addEventListener("click", (e) => {
        e.preventDefault();
        siteEl.classList.toggle("showsearch");
      });
    }
    if (searchClose && siteEl) {
      searchClose.addEventListener("click", (e) => {
        e.preventDefault();
        siteEl.classList.remove("showsearch");
      });
    }

    // الأكورديون (Cart & Single Product)
    document.querySelectorAll(".collapse .has-child > a").forEach((toggle) => {
      toggle.addEventListener("click", function (e) {
        e.preventDefault();
        this.closest(".has-child").classList.toggle("expand");
      });
    });

    // المودال الترويجي (#modal)
    const promoModal = document.getElementById("modal");
    if (promoModal && siteEl) {
      if (window.Store.isPromoDismissed()) {
        promoModal.style.display = "none";
      } else if (
        window.location.pathname.toLowerCase().endsWith("index.html") ||
        window.location.pathname === "/"
      ) {
        setTimeout(() => {
          if (!window.Store.isPromoDismissed())
            siteEl.classList.add("showmodal");
        }, 1200);
      }
      promoModal
        .querySelector(".modalclose")
        ?.addEventListener("click", (e) => {
          e.preventDefault();
          siteEl.classList.remove("showmodal");
          promoModal.style.display = "none";
        });
      promoModal.querySelector(".mini-text")?.addEventListener("click", (e) => {
        e.preventDefault();
        window.Store.dismissPromo();
        siteEl.classList.remove("showmodal");
        promoModal.style.display = "none";
        window.Store.toast("Promo popup hidden for this session");
      });
    }

    // Swiper Slider في الرئيسية
    if (
      typeof window.Swiper !== "undefined" &&
      document.querySelector(".myslider")
    ) {
      new Swiper(".myslider", {
        loop: true,
        autoplay: { delay: 4500, disableOnInteraction: false },
        pagination: { el: ".swiper-pagination", clickable: true },
      });
    }
  }

  // 2. ربط كل الروابط، الماركات، البانرات، القوائم الضخمة، والبحث
  function wireGlobalNavigation() {
    document.querySelectorAll('.logo a, a[href="/"]').forEach((a) => {
      a.setAttribute("href", "index.html");
    });

    // ربط روابط الهيدر والفوتر وقائمة الموبايل
    document
      .querySelectorAll("header a, .menu-bottom a, footer a, .off-canvas a")
      .forEach((a) => {
        const label = a.textContent.trim().toLowerCase();
        const href = a.getAttribute("href");
        if (!href || href === "#" || href === "#0") {
          if (label.includes("wishlist"))
            a.setAttribute("href", "wishlist.html");
          else if (
            label.includes("my account") ||
            label === "account" ||
            label.includes("your account")
          )
            a.setAttribute("href", "account.html");
          else if (
            label.includes("order tracking") ||
            label.includes("your orders")
          )
            a.setAttribute("href", "account.html?tab=orders");
          else if (label.includes("sign up") || label.includes("sign in"))
            a.setAttribute("href", "sign-in.html");
          else if (
            label.includes("featured") ||
            label.includes("best seller") ||
            label.includes("view all")
          )
            a.setAttribute("href", "page-category.html");
          else if (label.includes("shipping"))
            a.setAttribute("href", "cart.html");
          else if (label === "men" || label === "men's fashion") {
            a.addEventListener("click", (e) => {
              e.preventDefault();
              goToShop({ category: "Men" });
            });
          } else if (label === "women" || label === "women's fashion") {
            a.addEventListener("click", (e) => {
              e.preventDefault();
              goToShop({ category: "Women" });
            });
          } else if (label === "sports") {
            a.addEventListener("click", (e) => {
              e.preventDefault();
              goToShop({ category: "Sports" });
            });
          } else if (
            label.includes("electronic") ||
            label.includes("gatdets")
          ) {
            a.addEventListener("click", (e) => {
              e.preventDefault();
              goToShop({ category: "Electronic" });
            });
          } else if (label.includes("home")) {
            a.addEventListener("click", (e) => {
              e.preventDefault();
              goToShop({ category: "Home" });
            });
          } else if (label === "trending") {
            a.setAttribute("href", "index.html");
          } else if (label.startsWith("cart")) {
            a.setAttribute("href", "cart.html");
          } else if (
            label &&
            !a.classList.contains("t-close") &&
            !a.classList.contains("trigger") &&
            !a.classList.contains("dpt-trigger") &&
            !a.classList.contains("t-search")
          ) {
            // أي قسم فرعي في Mega Menu أو All Departments يبحث باسمه في المتجر
            a.addEventListener("click", (e) => {
              e.preventDefault();
              goToShop({ q: a.textContent.trim() });
            });
          }
        }
      });

    // ربط أزرار السلايدر الرئيسي (Shop Now)
    document.querySelectorAll(".slider .swiper-slide").forEach((slide) => {
      const heading =
        slide.querySelector("h4, h2")?.textContent.toLowerCase() || "";
      const btn = slide.querySelector(".primary-button");
      if (btn) {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          if (heading.includes("shoe")) goToShop({ q: "shoe" });
          else if (heading.includes("sofa") || heading.includes("wooden"))
            goToShop({ category: "Home" });
          else if (heading.includes("workout"))
            goToShop({ category: "Sports" });
          else goToShop({ category: "Women" });
        });
      }
    });

    // ربط شعارات الماركات (Zara, Samsung, Oppo, Asus, Hurley, D&G)
    document.querySelectorAll(".brands .item a").forEach((a) => {
      const img = a.querySelector("img");
      const src = img ? img.getAttribute("src") || "" : "";
      const brandMatch = src.match(/brands\/([a-z0-9]+)\./i);
      const brand = brandMatch ? brandMatch[1] : "";
      a.addEventListener("click", (e) => {
        e.preventDefault();
        goToShop({ category: brand });
      });
    });

    // ربط البانرات الترويجية وبطاقات الفئات أسفل الصفحة
    document.querySelectorAll(".banners .banner .item").forEach((item, idx) => {
      item.querySelectorAll("a").forEach((a) => {
        a.addEventListener("click", (e) => {
          e.preventDefault();
          goToShop({ category: idx === 0 ? "Home" : "Women" });
        });
      });
    });

    document.querySelectorAll(".product-categories .item").forEach((item) => {
      const title = item.querySelector("h4")?.textContent.toLowerCase() || "";
      const cat = title.includes("gatdet")
        ? "Electronic"
        : title.includes("home")
          ? "Home"
          : "Women";
      item.querySelectorAll("a").forEach((a) => {
        a.addEventListener("click", (e) => {
          e.preventDefault();
          goToShop({ category: cat });
        });
      });
    });

    // أيقونات القلب والسلة في الهيدر الرئيسي
    document.querySelectorAll(".header-nav .ri-heart-line").forEach((icon) => {
      const link = icon.closest("a");
      if (link) link.setAttribute("href", "wishlist.html");
    });
    document.querySelectorAll(".header-nav .iscart > a").forEach((link) => {
      link.setAttribute("href", "cart.html");
    });

    // زر Dark/Light Mode في الهيدر العلوي
    const topRightList = document.querySelector(
      ".header-top .right ul.main-links",
    );
    if (topRightList && !document.getElementById("ds-theme-toggle")) {
      const li = document.createElement("li");
      li.innerHTML = `<a href="#" id="ds-theme-toggle" title="Toggle Dark Mode"><i class="ri-contrast-2-line"></i> Theme</a>`;
      li.querySelector("a").addEventListener("click", (e) => {
        e.preventDefault();
        window.Theme.toggleTheme();
      });
      topRightList.appendChild(li);
    }

    // محول العملات
    document
      .querySelectorAll(".header-top .right ul.main-links > li")
      .forEach((li) => {
        const subLinks = li.querySelectorAll("ul li a");
        const currencies = ["USD", "EURO", "GBP", "IDR"];
        const isCurrencyMenu = Array.from(subLinks).some((a) =>
          currencies.includes(a.textContent.trim()),
        );
        if (isCurrencyMenu) {
          const trigger = li.querySelector(":scope > a");
          if (trigger) {
            trigger.innerHTML = `${window.Store.getCurrency()} <span class="icon-small"><i class="ri-arrow-down-s-line"></i></span>`;
          }
          subLinks.forEach((a) => {
            const code = a.textContent.trim();
            a.closest("li").classList.toggle(
              "current",
              code === window.Store.getCurrency(),
            );
            a.addEventListener("click", (e) => {
              e.preventDefault();
              window.Store.setCurrency(code);
            });
          });
        }
      });

    // نماذج البحث
    document
      .querySelectorAll(
        "header .search-box form.search, .search-bottom form.search",
      )
      .forEach((form) => {
        form.addEventListener("submit", (e) => {
          e.preventDefault();
          const input = form.querySelector('input[type="search"]');
          goToShop({ q: input ? input.value.trim() : "" });
        });
      });

    // النشرة البريدية
    document
      .querySelectorAll("footer .newsletter form.search, #modal form.search")
      .forEach((form) => {
        form.addEventListener("submit", (e) => {
          e.preventDefault();
          const inp = form.querySelector("input");
          if (inp && inp.value.trim()) {
            window.Store.applyCoupon("SAVE10");
            window.Store.toast(
              "Subscribed! Coupon SAVE10 (10% Off) activated in your cart.",
            );
            inp.value = "";
            const modal = document.getElementById("modal");
            if (modal) modal.style.display = "none";
            document.querySelector(".site")?.classList.remove("showmodal");
          }
        });
      });
  }

  // 3. مزامنة السلة المصغرة والعدادات وحساب المستخدم وشريط المقارنة في كل الصفحات
  function syncGlobalHeaderState() {
    const cart = window.Store.getCart();
    const count = window.Store.getCartCount();
    const totals = window.Store.getTotals();
    const wishCount = window.Store.getWishlist().length;
    const user = window.Store.getCurrentUser();

    document
      .querySelectorAll(
        ".iscart .item-number, .menu-bottom .ri-shopping-cart-line ~ .fly-item .item-number",
      )
      .forEach((el) => {
        el.textContent = String(count);
      });

    document.querySelectorAll(".iscart .cart-total").forEach((el) => {
      el.textContent = window.Store.formatPrice(totals.subtotal);
    });

    document.querySelectorAll(".header-nav .ri-heart-line").forEach((icon) => {
      const li = icon.closest("li");
      const badge = li ? li.querySelector(".item-number") : null;
      if (badge) badge.textContent = String(wishCount);
    });

    document.querySelectorAll(".mini-cart").forEach((miniCart) => {
      const head = miniCart.querySelector(".cart-head");
      const bodyList = miniCart.querySelector(".cart-body ul.products.mini");
      const subEl = miniCart.querySelector(".cart-footer .subtotal strong");

      if (head)
        head.textContent = `${count} ${count === 1 ? "item" : "items"} in cart`;
      if (subEl) subEl.textContent = window.Store.formatPrice(totals.subtotal);

      if (bodyList) {
        if (cart.length === 0) {
          bodyList.innerHTML = `<li class="item" style="justify-content:center;padding:20px 0;color:#7c899a;">Your cart is empty</li>`;
        } else {
          bodyList.innerHTML = cart
            .map(
              (item) => `
              <li class="item">
                <div class="thumbnail object-cover">
                  <a href="product.html?id=${encodeURIComponent(item.id)}"><img src="${escapeHtml(item.image)}" alt="" /></a>
                </div>
                <div class="item-content">
                  <p><a href="product.html?id=${encodeURIComponent(item.id)}">${escapeHtml(item.name)}</a></p>
                  <span class="price">
                    <span>${window.Store.formatPrice(item.price)}</span>
                    <span class="fly-item"><span>${item.qty}x</span></span>
                  </span>
                </div>
                <a href="#" class="item-remove" data-remove-cart="${escapeHtml(item.key)}"><i class="ri-close-line"></i></a>
              </li>`,
            )
            .join("");

          bodyList.querySelectorAll("[data-remove-cart]").forEach((btn) => {
            btn.addEventListener("click", (e) => {
              e.preventDefault();
              window.Store.removeFromCart(btn.getAttribute("data-remove-cart"));
            });
          });
        }
      }
    });

    document.querySelectorAll('a[href="sign-in.html"]').forEach((a) => {
      if (user) {
        a.textContent = `Hi, ${user.name.split(" ")[0]}`;
        a.setAttribute("href", "account.html");
      } else {
        a.textContent = "Sign Up";
        a.setAttribute("href", "sign-in.html");
      }
    });

    renderCompareBar();
  }

  // شريط مقارنة المنتجات العائم
  function renderCompareBar() {
    const ids = window.Store.getCompareList();
    let bar = document.getElementById("ds-compare-bar");
    if (!ids.length) {
      if (bar) bar.remove();
      return;
    }
    if (!bar) {
      bar = document.createElement("div");
      bar.id = "ds-compare-bar";
      bar.className = "ds-compare-bar";
      document.body.appendChild(bar);
    }
    const items = ids
      .map((id) => window.MockApi.getProductSync(id))
      .filter(Boolean);
    bar.innerHTML = `
      <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;">
        <strong>Compare (${items.length}/3):</strong>
        ${items
          .map(
            (p) => `
            <span style="background:#1f2937;padding:4px 10px;border-radius:16px;font-size:12px;display:inline-flex;align-items:center;gap:6px;">
              ${escapeHtml(p.name.slice(0, 22))}
              <button type="button" data-rm-cmp="${escapeHtml(p.id)}" style="background:none;border:none;color:#ff6b6b;cursor:pointer;font-weight:700;">&times;</button>
            </span>`,
          )
          .join("")}
      </div>
      <div style="display:flex;gap:8px;">
        <button type="button" id="ds-open-cmp" class="ds-btn ds-btn-primary" style="padding:7px 14px;font-size:12px;">Compare Now</button>
        <button type="button" id="ds-clear-cmp" class="ds-btn ds-btn-outline" style="padding:7px 12px;font-size:12px;color:#fff;">Clear</button>
      </div>`;

    bar.querySelectorAll("[data-rm-cmp]").forEach((b) => {
      b.addEventListener("click", () =>
        window.Store.toggleCompare(b.getAttribute("data-rm-cmp")),
      );
    });
    bar
      .querySelector("#ds-clear-cmp")
      ?.addEventListener("click", () => window.Store.clearCompare());
    bar
      .querySelector("#ds-open-cmp")
      ?.addEventListener("click", () => openCompareModal(items));
  }

  function openCompareModal(items) {
    document.getElementById("ds-compare-modal")?.remove();
    const modal = document.createElement("div");
    modal.id = "ds-compare-modal";
    modal.className = "ds-modal-backdrop";
    modal.innerHTML = `
      <div class="ds-modal-box">
        <button id="ds-cmp-close" style="position:absolute;top:14px;right:14px;border:none;background:#f3f4f6;width:32px;height:32px;border-radius:50%;cursor:pointer;font-size:18px;">&times;</button>
        <h2 style="margin-bottom:16px;">Product Comparison</h2>
        <div style="overflow-x:auto;">
          <table style="width:100%;border-collapse:collapse;text-align:left;font-size:13px;">
            <thead>
              <tr>
                <th style="padding:10px;border-bottom:1px solid #e5e8ec;">Feature</th>
                ${items.map((p) => `<th style="padding:10px;border-bottom:1px solid #e5e8ec;"><img src="${escapeHtml(p.image)}" style="width:70px;height:70px;object-fit:cover;border-radius:8px;display:block;margin-bottom:6px;" />${escapeHtml(p.name)}</th>`).join("")}
              </tr>
            </thead>
            <tbody>
              <tr><td style="padding:10px;border-bottom:1px solid #e5e8ec;font-weight:700;">Price</td>${items.map((p) => `<td style="padding:10px;border-bottom:1px solid #e5e8ec;color:#ff6b6b;font-weight:700;">${window.Store.formatPrice(p.price)}</td>`).join("")}</tr>
              <tr><td style="padding:10px;border-bottom:1px solid #e5e8ec;font-weight:700;">Category</td>${items.map((p) => `<td style="padding:10px;border-bottom:1px solid #e5e8ec;">${escapeHtml(p.category)}</td>`).join("")}</tr>
              <tr><td style="padding:10px;border-bottom:1px solid #e5e8ec;font-weight:700;">Brand</td>${items.map((p) => `<td style="padding:10px;border-bottom:1px solid #e5e8ec;">${escapeHtml(p.brand || "Standard")}</td>`).join("")}</tr>
              <tr><td style="padding:10px;border-bottom:1px solid #e5e8ec;font-weight:700;">Rating</td>${items.map((p) => `<td style="padding:10px;border-bottom:1px solid #e5e8ec;">★ ${p.rating} (${p.reviewsCount})</td>`).join("")}</tr>
              <tr><td style="padding:10px;border-bottom:1px solid #e5e8ec;font-weight:700;">Availability</td>${items.map((p) => `<td style="padding:10px;border-bottom:1px solid #e5e8ec;">${p.stock > 0 ? p.stock + " in stock" : "Out of stock"}</td>`).join("")}</tr>
              <tr><td style="padding:10px;">Action</td>${items.map((p) => `<td style="padding:10px;"><button type="button" class="ds-btn ds-btn-primary" data-cmp-add="${escapeHtml(p.id)}">Add to Cart</button></td>`).join("")}</tr>
            </tbody>
          </table>
        </div>
      </div>`;
    document.body.appendChild(modal);
    modal.addEventListener("click", (e) => {
      if (e.target === modal || e.target.id === "ds-cmp-close") modal.remove();
    });
    modal.querySelectorAll("[data-cmp-add]").forEach((b) => {
      b.addEventListener("click", () => {
        window.Store.addToCart(b.getAttribute("data-cmp-add"), 1);
        modal.remove();
      });
    });
  }

  // 4. تفعيل البطاقات الثابتة في الرئيسية وصفحات المنتجات
  function bindStaticProductCards() {
    const allProducts = window.MockApi.getAllSync();

    document.querySelectorAll(".products .item").forEach((card) => {
      if (
        card.closest(".single-product") ||
        card.closest(".single-cart") ||
        card.closest(".mini-cart")
      )
        return;

      const img = card.querySelector("img");
      const titleLink = card.querySelector("h3 a");
      const src = img ? img.getAttribute("src") : "";

      let matched = allProducts.find((p) => src && p.image === src);
      if (!matched && titleLink) {
        const t = titleLink.textContent.trim().toLowerCase().slice(0, 18);
        matched = allProducts.find((p) => p.name.toLowerCase().includes(t));
      }
      if (!matched) return;

      const curPrice = card.querySelector(".price .current");
      const oldPrice = card.querySelector(".price .normal");
      if (curPrice)
        curPrice.textContent = window.Store.formatPrice(matched.price);
      if (oldPrice && matched.oldPrice)
        oldPrice.textContent = window.Store.formatPrice(matched.oldPrice);

      card.querySelectorAll(".media a, h3 a").forEach((a) => {
        if (a.closest(".hoverable")) return;
        a.setAttribute(
          "href",
          `product.html?id=${encodeURIComponent(matched.id)}`,
        );
        a.onclick = (e) => {
          e.preventDefault();
          openProduct(matched.id);
        };
      });

      const heartBtn = card
        .querySelector(".hoverable .ri-heart-line")
        ?.closest("a");
      const eyeBtn = card
        .querySelector(".hoverable .ri-eye-line")
        ?.closest("a");
      const cmpBtn = card
        .querySelector(".hoverable .ri-shuffle-line")
        ?.closest("a");

      if (heartBtn) {
        const li = heartBtn.closest("li");
        li.classList.toggle(
          "is-wishlisted",
          window.Store.isInWishlist(matched.id),
        );
        heartBtn.setAttribute("title", "Toggle Wishlist");
        heartBtn.onclick = (e) => {
          e.preventDefault();
          const active = window.Store.toggleWishlist(matched.id);
          li.classList.toggle("is-wishlisted", active);
        };
      }

      if (eyeBtn) {
        eyeBtn.setAttribute("title", "Quick View");
        eyeBtn.onclick = (e) => {
          e.preventDefault();
          openQuickViewModal(matched);
        };
      }

      if (cmpBtn) {
        const li = cmpBtn.closest("li");
        li.classList.toggle(
          "is-compared",
          window.Store.isInCompare(matched.id),
        );
        cmpBtn.setAttribute("title", "Compare Product");
        cmpBtn.onclick = (e) => {
          e.preventDefault();
          const active = window.Store.toggleCompare(matched.id);
          li.classList.toggle("is-compared", active);
        };
      }

      // إضافة زر Add to Cart سريع أسفل الكروت الرئيسية إن لم يكن موجودًا
      const contentBox = card.querySelector(".content");
      if (
        contentBox &&
        !card.closest(".products.mini") &&
        !contentBox.querySelector(".ds-card-quick-add")
      ) {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "ds-card-quick-add";
        btn.textContent = matched.stock > 0 ? "+ Add to Cart" : "Out of Stock";
        btn.disabled = matched.stock <= 0;
        btn.addEventListener("click", () =>
          window.Store.addToCart(matched.id, 1),
        );
        contentBox.appendChild(btn);
      }
    });
  }

  function openQuickViewModal(product) {
    document.getElementById("ds-quick-modal")?.remove();
    const variants = product.colors || product.sizes || [];
    let chosenVariant = variants[0] || "";

    const modal = document.createElement("div");
    modal.id = "ds-quick-modal";
    modal.className = "ds-modal-backdrop";
    modal.innerHTML = `
      <div class="ds-modal-box">
        <button id="ds-qv-close" style="position:absolute;top:14px;right:14px;border:none;background:#f3f4f6;width:32px;height:32px;border-radius:50%;cursor:pointer;font-size:18px;">&times;</button>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:24px;align-items:center;">
          <img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.name)}" style="width:100%;border-radius:10px;max-height:300px;object-fit:cover;" />
          <div>
            <span style="font-size:12px;color:#ff6b6b;font-weight:700;">${escapeHtml(product.category)} • ${escapeHtml(product.brand || "")}</span>
            <h2 style="margin:6px 0 10px;font-size:21px;">${escapeHtml(product.name)}</h2>
            <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;">
              <strong style="font-size:22px;color:#ff6b6b;">${window.Store.formatPrice(product.price)}</strong>
              ${product.oldPrice ? `<span style="text-decoration:line-through;color:#7c899a;">${window.Store.formatPrice(product.oldPrice)}</span>` : ""}
            </div>
            <p style="font-size:14px;line-height:1.6;margin-bottom:14px;">${escapeHtml(product.description)}</p>
            ${
              variants.length
                ? `<div style="margin-bottom:14px;">
                    <div style="font-size:12px;font-weight:700;margin-bottom:6px;">Select Option:</div>
                    <div style="display:flex;gap:8px;flex-wrap:wrap;" id="ds-qv-variants">
                      ${variants.map((v, i) => `<button type="button" class="ds-swatch-btn ${i === 0 ? "active" : ""}" data-var="${escapeHtml(v)}">${escapeHtml(v)}</button>`).join("")}
                    </div>
                  </div>`
                : ""
            }
            <p style="font-size:13px;margin-bottom:16px;">Availability: <strong>${product.stock > 0 ? product.stock + " in stock" : "Out of stock"}</strong></p>
            <div style="display:flex;gap:10px;flex-wrap:wrap;">
              <button id="ds-qv-add" class="ds-btn ds-btn-primary" ${product.stock <= 0 ? "disabled" : ""}>Add to Cart</button>
              <button id="ds-qv-wish" class="ds-btn ds-btn-outline">${window.Store.isInWishlist(product.id) ? "Wishlisted ♥" : "Wishlist"}</button>
              <a href="product.html?id=${encodeURIComponent(product.id)}" class="ds-btn ds-btn-dark">Full Details</a>
            </div>
          </div>
        </div>
      </div>`;
    document.body.appendChild(modal);

    modal.querySelectorAll("[data-var]").forEach((btn) => {
      btn.addEventListener("click", () => {
        modal
          .querySelectorAll("[data-var]")
          .forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        chosenVariant = btn.getAttribute("data-var");
      });
    });

    modal.addEventListener("click", (e) => {
      if (e.target === modal || e.target.id === "ds-qv-close") modal.remove();
    });
    modal.querySelector("#ds-qv-add").addEventListener("click", () => {
      window.Store.addToCart(product.id, 1, chosenVariant);
      modal.remove();
    });
    modal.querySelector("#ds-qv-wish").addEventListener("click", (e) => {
      const added = window.Store.toggleWishlist(product.id);
      e.target.textContent = added ? "Wishlisted ♥" : "Wishlist";
    });
  }

  // 5. صفحة السلة (cart.html)
  function initCartPage() {
    const tbody = document.querySelector("#cart-table tbody");
    if (!tbody) return;

    function renderCart() {
      const cart = window.Store.getCart();
      const totals = window.Store.getTotals();

      if (cart.length === 0) {
        tbody.innerHTML = `
          <tr>
            <td colspan="5" style="text-align:center;padding:40px 16px;">
              <p style="margin-bottom:16px;font-size:16px;">Your shopping cart is currently empty.</p>
              <a href="page-category.html" class="primary-button">Continue Shopping</a>
            </td>
          </tr>`;
      } else {
        tbody.innerHTML = cart
          .map(
            (item) => `
            <tr>
              <td class="flexitem">
                <div class="thumbnail object-cover">
                  <a href="product.html?id=${encodeURIComponent(item.id)}"><img src="${escapeHtml(item.image)}" alt="" /></a>
                </div>
                <div class="content">
                  <strong><a href="product.html?id=${encodeURIComponent(item.id)}">${escapeHtml(item.name)}</a></strong>
                  ${item.variant ? `<p>Option: ${escapeHtml(item.variant)}</p>` : ""}
                </div>
              </td>
              <td>${window.Store.formatPrice(item.price)}</td>
              <td>
                <div class="qty-control flexitem">
                  <button type="button" class="minus" data-qty-dec="${escapeHtml(item.key)}">-</button>
                  <input type="text" value="${item.qty}" min="1" data-qty-input="${escapeHtml(item.key)}" />
                  <button type="button" class="plus" data-qty-inc="${escapeHtml(item.key)}">+</button>
                </div>
              </td>
              <td>${window.Store.formatPrice(item.price * item.qty)}</td>
              <td>
                <a href="#" class="item-remove" data-cart-del="${escapeHtml(item.key)}"><i class="ri-close-line"></i></a>
              </td>
            </tr>`,
          )
          .join("");
      }

      tbody.querySelectorAll("[data-qty-dec]").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          const key = btn.getAttribute("data-qty-dec");
          const found = cart.find((i) => i.key === key);
          if (found) window.Store.updateCartQty(key, found.qty - 1);
        });
      });
      tbody.querySelectorAll("[data-qty-inc]").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          const key = btn.getAttribute("data-qty-inc");
          const found = cart.find((i) => i.key === key);
          if (found) window.Store.updateCartQty(key, found.qty + 1);
        });
      });
      tbody.querySelectorAll("[data-qty-input]").forEach((inp) => {
        inp.addEventListener("change", () => {
          const key = inp.getAttribute("data-qty-input");
          window.Store.updateCartQty(
            key,
            Math.max(1, parseInt(inp.value, 10) || 1),
          );
        });
      });
      tbody.querySelectorAll("[data-cart-del]").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          window.Store.removeFromCart(btn.getAttribute("data-cart-del"));
        });
      });

      // تحديث جدول الإجماليات
      const totalTableRows = document.querySelectorAll(
        ".cart-total table tbody tr",
      );
      if (totalTableRows.length >= 4) {
        totalTableRows[0].querySelector("td").textContent =
          window.Store.formatPrice(totals.subtotal);
        totalTableRows[1].querySelector("td").textContent =
          "-" + window.Store.formatPrice(totals.discount);
        totalTableRows[2].querySelector("th").innerHTML =
          `Shipping & Tax <span class="mini-text">(${totals.shippingMethod})</span>`;
        totalTableRows[2].querySelector("td").textContent =
          window.Store.formatPrice(totals.shipping + totals.tax);
        totalTableRows[3].querySelector("td strong").textContent =
          window.Store.formatPrice(totals.total);
      }
    }

    // ربط الكوبون
    const couponInput = document.querySelector(".cart-summary .coupon input");
    const couponBtn = document.querySelector(".cart-summary .coupon button");
    if (couponInput && couponBtn) {
      const activeCoupon = window.Store.getCoupon();
      if (activeCoupon) couponInput.value = activeCoupon.code;
      couponBtn.type = "button";
      couponBtn.addEventListener("click", (e) => {
        e.preventDefault();
        const res = window.Store.applyCoupon(couponInput.value);
        if (!res.ok) window.Store.toast(res.message);
      });
    }

    // ربط حاسبة الدولة والشحن
    const countrySelect = document.querySelector(
      ".shipping-rate select[name='country']",
    );
    if (countrySelect) {
      const dest = window.Store.getDestination();
      if (dest.country) countrySelect.value = dest.country;
      countrySelect.addEventListener("change", () => {
        window.Store.setDestination({ country: countrySelect.value });
        window.Store.toast("Shipping & tax estimate updated");
      });
    }

    const flatRadio = document.getElementById("flat");
    const bestRadio = document.getElementById("best");
    if (flatRadio && bestRadio) {
      flatRadio.checked = window.Store.getShippingMethod() === "flat";
      bestRadio.checked = window.Store.getShippingMethod() === "best";
      flatRadio.addEventListener("change", () =>
        window.Store.setShippingMethod("flat"),
      );
      bestRadio.addEventListener("change", () =>
        window.Store.setShippingMethod("best"),
      );
    }

    renderCart();
    window.Store.subscribe(renderCart);
  }

  // 6. صفحة إتمام الطلب (checkout.html)
  function initCheckoutPage() {
    const checkoutWrap = document.querySelector(".single-checkout");
    if (!checkoutWrap) return;

    const user = window.Store.getCurrentUser();
    if (user) {
      const parts = user.name.split(" ");
      const setVal = (id, v) => {
        const el = document.getElementById(id);
        if (el && v) el.value = v;
      };
      setVal("email", user.email);
      setVal("fname", parts[0]);
      setVal("lname", parts.slice(1).join(" "));
      setVal("address", user.address);
      setVal("city", user.city);
      setVal("phone", user.phone);
    }

    // حقن قسم اختيار وسيلة الدفع إن لم يكن موجودًا
    const shippingDiv = checkoutWrap.querySelector(".shipping-methods");
    if (shippingDiv && !document.getElementById("ds-payment-methods")) {
      const payDiv = document.createElement("div");
      payDiv.id = "ds-payment-methods";
      payDiv.style.marginTop = "24px";
      payDiv.innerHTML = `
        <h2>Payment Method</h2>
        <div style="display:flex;flex-direction:column;gap:10px;margin-top:10px;">
          <label style="display:flex;align-items:center;gap:8px;cursor:pointer;">
            <input type="radio" name="ds-pay" value="Cash on Delivery" checked />
            <span>Cash on Delivery (COD)</span>
          </label>
          <label style="display:flex;align-items:center;gap:8px;cursor:pointer;">
            <input type="radio" name="ds-pay" value="Credit / Debit Card" />
            <span>Credit / Debit Card (Visa / Mastercard)</span>
          </label>
          <label style="display:flex;align-items:center;gap:8px;cursor:pointer;">
            <input type="radio" name="ds-pay" value="PayPal" />
            <span>PayPal Express</span>
          </label>
        </div>`;
      shippingDiv.after(payDiv);
    }

    function renderSummary() {
      const cart = window.Store.getCart();
      const totals = window.Store.getTotals();
      const summaryLis = checkoutWrap.querySelectorAll(".summary-totals ul li");
      if (summaryLis.length >= 4) {
        summaryLis[0].querySelectorAll("span")[1].textContent =
          window.Store.formatPrice(totals.subtotal);
        summaryLis[1].querySelectorAll("span")[1].textContent =
          "-" + window.Store.formatPrice(totals.discount);
        summaryLis[2].querySelectorAll("span")[0].textContent =
          `Shipping & Tax (${totals.shippingMethod === "best" ? "Free" : "Flat"})`;
        summaryLis[2].querySelectorAll("span")[1].textContent =
          window.Store.formatPrice(totals.shipping + totals.tax);
        summaryLis[3].querySelector("strong").textContent =
          window.Store.formatPrice(totals.total);
      }

      const miniList = checkoutWrap.querySelector(
        ".summary-order ul.products.mini",
      );
      if (miniList) {
        if (!cart.length) {
          miniList.innerHTML = `<li class="item"><p>No items in cart. <a href="page-category.html" style="color:#ff6b6b;">Shop now</a></p></li>`;
        } else {
          miniList.innerHTML = cart
            .map(
              (item) => `
              <li class="item">
                <div class="thumbnail object-cover"><img src="${escapeHtml(item.image)}" alt="" /></div>
                <div class="item-content">
                  <p>${escapeHtml(item.name)} ${item.variant ? `(${escapeHtml(item.variant)})` : ""}</p>
                  <span class="price">
                    <span>${window.Store.formatPrice(item.price)}</span>
                    <span>x ${item.qty}</span>
                  </span>
                </div>
              </li>`,
            )
            .join("");
        }
      }
    }

    const placeOrderBtn = checkoutWrap.querySelector(
      ".primary-checkout .primary-button",
    );
    if (placeOrderBtn) {
      placeOrderBtn.type = "button";
      placeOrderBtn.addEventListener("click", (e) => {
        e.preventDefault();
        const email = document.getElementById("email")?.value.trim();
        const fname = document.getElementById("fname")?.value.trim();
        const lname = document.getElementById("lname")?.value.trim();
        const address = document.getElementById("address")?.value.trim();
        const city = document.getElementById("city")?.value.trim();
        const phone = document.getElementById("phone")?.value.trim();
        const notes =
          checkoutWrap.querySelector("textarea")?.value.trim() || "";
        const createAcc = document.getElementById("anaccount")?.checked;
        const payMethod =
          checkoutWrap.querySelector('input[name="ds-pay"]:checked')?.value ||
          "Cash on Delivery";

        if (!email || !fname || !address || !city) {
          window.Store.toast(
            "Please fill in Email, First Name, Street Address, and City.",
          );
          return;
        }

        if (createAcc && !window.Store.getCurrentUser()) {
          window.Store.signUp({
            name: `${fname} ${lname}`.trim(),
            email,
            password: "user123",
            phone,
            city,
            address,
          });
        }

        const result = window.Store.placeOrder(
          { name: `${fname} ${lname}`.trim(), email, address, city, phone },
          notes,
          payMethod,
        );

        if (!result.ok) {
          window.Store.toast(result.message);
          return;
        }

        window.Store.toast(`Order ${result.order.id} placed successfully!`);
        setTimeout(() => {
          window.location.href = `account.html?tab=orders&order=${encodeURIComponent(result.order.id)}`;
        }, 700);
      });
    }

    renderSummary();
    window.Store.subscribe(renderSummary);
  }

  // 7. صفحة تفاصيل المنتج (product.html / Electrical_products.html / page-offer.html)
  function initSingleProductPage() {
    const singleWrap = document.querySelector(".single-product");
    if (!singleWrap) return;

    const path = window.location.pathname.toLowerCase();
    const isDynamicProductPage = path.endsWith("product.html");
    const productId = isDynamicProductPage
      ? window.Store.getSelectedProduct()
      : path.includes("offer")
        ? "apparel4"
        : "electronic1";

    const product = window.MockApi.getProductSync(productId);
    if (!product) return;

    window.Store.recordRecentlyViewed(product.id);

    let selectedVariant =
      (product.colors && product.colors[0]) ||
      (product.sizes && product.sizes[0]) ||
      "";

    if (isDynamicProductPage) {
      const titleEl = singleWrap.querySelector("h1");
      if (titleEl) titleEl.textContent = product.name;
      const breadLi = singleWrap.querySelectorAll(".breadcrumb li");
      if (breadLi.length >= 3) {
        breadLi[1].innerHTML = `<a href="page-category.html?category=${encodeURIComponent(product.category)}">${escapeHtml(product.category)}</a>`;
        breadLi[2].textContent = product.name;
      }
      const curEl = singleWrap.querySelector(".price .current");
      const oldEl = singleWrap.querySelector(".price .normal");
      if (curEl) curEl.textContent = window.Store.formatPrice(product.price);
      if (oldEl)
        oldEl.textContent = product.oldPrice
          ? window.Store.formatPrice(product.oldPrice)
          : "";
      const discEl = singleWrap.querySelector(".price .discount");
      if (discEl) discEl.innerHTML = `${product.discount}% <br />OFF`;

      const stockEl = singleWrap.querySelector(".stock-sku .available");
      if (stockEl)
        stockEl.textContent =
          product.stock > 0 ? `In Stock (${product.stock})` : "Out of Stock";

      const bigImg = singleWrap.querySelector(".big-image img");
      if (bigImg) bigImg.src = product.image;

      // شريط صور مصغرة تفاعلي
      const bigBox = singleWrap.querySelector(".big-image");
      if (
        bigBox &&
        product.gallery &&
        product.gallery.length > 1 &&
        !singleWrap.querySelector(".ds-thumb-strip")
      ) {
        const strip = document.createElement("div");
        strip.className = "ds-thumb-strip";
        strip.innerHTML = product.gallery
          .map(
            (src, idx) =>
              `<img src="${escapeHtml(src)}" class="${idx === 0 ? "active" : ""}" alt="" />`,
          )
          .join("");
        strip.querySelectorAll("img").forEach((t) => {
          t.addEventListener("click", () => {
            strip
              .querySelectorAll("img")
              .forEach((x) => x.classList.remove("active"));
            t.classList.add("active");
            if (bigImg) bigImg.src = t.src;
          });
        });
        bigBox.after(strip);
      }

      // خيارات الألوان أو المقاسات
      const variants = product.colors || product.sizes || [];
      const priceBox = singleWrap.querySelector(".content > .price");
      if (
        variants.length &&
        priceBox &&
        !singleWrap.querySelector("#ds-detail-variants")
      ) {
        const vBox = document.createElement("div");
        vBox.id = "ds-detail-variants";
        vBox.style.margin = "16px 0";
        vBox.innerHTML = `
          <p style="font-weight:700;font-size:13px;margin-bottom:8px;">${product.colors ? "Color" : "Size"}: <span id="ds-chosen-var">${escapeHtml(selectedVariant)}</span></p>
          <div style="display:flex;gap:8px;flex-wrap:wrap;">
            ${variants.map((v, i) => `<button type="button" class="ds-swatch-btn ${i === 0 ? "active" : ""}" data-var="${escapeHtml(v)}">${escapeHtml(v)}</button>`).join("")}
          </div>`;
        vBox.querySelectorAll("[data-var]").forEach((btn) => {
          btn.addEventListener("click", () => {
            vBox
              .querySelectorAll("[data-var]")
              .forEach((b) => b.classList.remove("active"));
            btn.classList.add("active");
            selectedVariant = btn.getAttribute("data-var");
            vBox.querySelector("#ds-chosen-var").textContent = selectedVariant;
          });
        });
        priceBox.after(vBox);
      }

      const descP = singleWrap.querySelector(".description .content p");
      if (descP) descP.textContent = product.description;

      // عرض المواصفات الفنية إن وجدت
      const specsList = singleWrap.querySelector("#ds-specs-list");
      if (specsList && product.specs) {
        specsList.innerHTML = Object.entries(product.specs)
          .map(
            ([k, v]) =>
              `<li><span>${escapeHtml(k)}</span> <span>${escapeHtml(v)}</span></li>`,
          )
          .join("");
      }
    } else {
      // في Electrical_products.html: تفعيل دوائر الألوان الموجودة
      singleWrap
        .querySelectorAll('.colors input[name="color"]')
        .forEach((radio) => {
          radio.addEventListener("change", () => {
            const map = {
              cogery: "Eclipse Gray",
              coblue: "Midnight Blue",
              cogreen: "Volt Green",
            };
            selectedVariant = map[radio.id] || radio.id;
          });
        });
    }

    // أزرار الكمية
    const qtyInput = singleWrap.querySelector(".actions .qty-control input");
    const minusBtn = singleWrap.querySelector(".actions .qty-control .minus");
    const plusBtn = singleWrap.querySelector(".actions .qty-control .plus");
    if (qtyInput && minusBtn && plusBtn) {
      minusBtn.type = "button";
      plusBtn.type = "button";
      minusBtn.addEventListener("click", () => {
        qtyInput.value = Math.max(1, (parseInt(qtyInput.value, 10) || 1) - 1);
      });
      plusBtn.addEventListener("click", () => {
        qtyInput.value = Math.min(
          Math.max(1, product.stock),
          (parseInt(qtyInput.value, 10) || 1) + 1,
        );
      });
    }

    // زر Add to cart
    const addCartBtn = singleWrap.querySelector(".button-cart .primary-button");
    if (addCartBtn) {
      addCartBtn.type = "button";
      addCartBtn.addEventListener("click", () => {
        const qty = qtyInput ? parseInt(qtyInput.value, 10) || 1 : 1;
        window.Store.addToCart(product.id, qty, selectedVariant);
      });
    }

    // Wishlist & Share
    singleWrap.querySelectorAll(".wish-share a").forEach((a) => {
      const txt = a.textContent.trim().toLowerCase();
      if (txt.includes("wishlist")) {
        a.addEventListener("click", (e) => {
          e.preventDefault();
          window.Store.toggleWishlist(product.id);
        });
      }
      if (txt.includes("share")) {
        a.addEventListener("click", (e) => {
          e.preventDefault();
          if (navigator.clipboard)
            navigator.clipboard.writeText(window.location.href).catch(() => {});
          window.Store.toast("Product link copied to clipboard!");
        });
      }
    });

    // إصلاح زر Add Your review / Write review ليفتح التبويب وينزل للنموذج
    singleWrap
      .querySelectorAll('.add-review, a[href="#review-form"]')
      .forEach((link) => {
        link.addEventListener("click", (e) => {
          e.preventDefault();
          const revAccordion = singleWrap
            .querySelector(".reviews")
            ?.closest(".has-child");
          if (revAccordion) revAccordion.classList.add("expand");
          const formBox =
            singleWrap.querySelector(".review-form form") ||
            singleWrap.querySelector("#review-rorm");
          formBox?.scrollIntoView({ behavior: "smooth", block: "center" });
        });
      });

    // تقييمات العملاء
    const reviewListUl = singleWrap.querySelector(".review-block-body ul");
    const reviewForm = singleWrap.querySelector(".review-form form");
    function renderReviews() {
      if (!reviewListUl) return;
      const reviews = window.Store.getReviews(product.id);
      reviewListUl.innerHTML = reviews
        .map(
          (r) => `
          <li class="item">
            <div class="review-form">
              <p class="person">Review by ${escapeHtml(r.name)}</p>
              <p class="mini-text">On ${escapeHtml(r.date)} • <span style="color:#f59e0b;">${"★".repeat(r.rating)}</span></p>
            </div>
            <div class="review-title"><p>${escapeHtml(r.summary)}</p></div>
            <div class="review-text"><p>${escapeHtml(r.text)}</p></div>
          </li>`,
        )
        .join("");
    }
    renderReviews();

    if (reviewForm) {
      const submitBtn = reviewForm.querySelector(".primary-button");
      if (submitBtn) {
        submitBtn.addEventListener("click", (e) => {
          e.preventDefault();
          const inputs = reviewForm.querySelectorAll("input[type='text']");
          const textarea = reviewForm.querySelector("textarea");
          const ratingInput = singleWrap.querySelector(
            '.rate-this input[name="rating"]:checked',
          );
          const rating = ratingInput
            ? Number(ratingInput.id.replace("star", ""))
            : 5;
          window.Store.addReview(product.id, {
            name:
              inputs[0]?.value.trim() ||
              window.Store.getCurrentUser()?.name ||
              "Customer",
            summary: inputs[1]?.value.trim() || "Great product",
            text: textarea?.value.trim() || "",
            rating,
          });
          if (inputs[0]) inputs[0].value = "";
          if (inputs[1]) inputs[1].value = "";
          if (textarea) textarea.value = "";
          renderReviews();
        });
      }
    }
  }

  // 8. صفحة المتجر والفلترة (page-category.html)
  function initCategoryPage() {
    const container = document.getElementById("category-products-grid");
    if (!container) return;

    const navFilter = window.Store.getNavigationFilter();
    const searchInput = document.getElementById("shop-search-input");
    const categorySelect = document.getElementById("shop-category-select");
    const sortSelect = document.getElementById("shop-sort-select");
    const priceRange = document.getElementById("shop-price-range");
    const priceLabel = document.getElementById("shop-price-value");
    const stockCheck = document.getElementById("shop-instock-only");

    if (searchInput && navFilter.q) searchInput.value = navFilter.q;
    if (categorySelect && navFilter.category) {
      const optExists = Array.from(categorySelect.options).some(
        (o) => o.value.toLowerCase() === navFilter.category.toLowerCase(),
      );
      if (optExists) {
        categorySelect.value = Array.from(categorySelect.options).find(
          (o) => o.value.toLowerCase() === navFilter.category.toLowerCase(),
        ).value;
      } else if (searchInput && !searchInput.value) {
        searchInput.value = navFilter.category;
      }
    }

    async function renderGrid() {
      const q = searchInput ? searchInput.value : navFilter.q;
      const category = categorySelect
        ? categorySelect.value
        : navFilter.category;
      const sort = sortSelect ? sortSelect.value : "default";
      const maxPrice = priceRange ? Number(priceRange.value) : 0;
      const inStockOnly = stockCheck ? stockCheck.checked : false;
      if (priceLabel && maxPrice)
        priceLabel.textContent = window.Store.formatPrice(maxPrice);

      const products = await window.MockApi.getProducts({
        q,
        category,
        sort,
        maxPrice,
        inStockOnly,
      });
      const countEl = document.getElementById("shop-results-count");
      if (countEl) countEl.textContent = `Showing ${products.length} products`;

      if (!products.length) {
        container.innerHTML = `<div style="padding:40px;text-align:center;grid-column:1/-1;"><h3>No matching products found</h3><p style="margin-top:8px;">Try clearing your search or price filter.</p></div>`;
        return;
      }

      container.innerHTML = products
        .map(
          (p) => `
          <div class="ds-card">
            <div class="ds-card-img">
              <a href="product.html?id=${encodeURIComponent(p.id)}" data-open-prod="${escapeHtml(p.id)}">
                <img src="${escapeHtml(p.image)}" alt="${escapeHtml(p.name)}" />
              </a>
              ${p.discount ? `<span style="position:absolute;top:10px;left:10px;background:#0a021c;color:#fff;padding:3px 9px;border-radius:12px;font-size:11px;font-weight:700;">-${p.discount}%</span>` : ""}
              ${p.stock <= 0 ? `<span style="position:absolute;top:10px;right:10px;background:#dc2626;color:#fff;padding:3px 9px;border-radius:12px;font-size:11px;font-weight:700;">Sold Out</span>` : ""}
            </div>
            <div class="ds-card-body">
              <span style="font-size:12px;color:#7c899a;">${escapeHtml(p.category)} • ★ ${p.rating}</span>
              <h3 style="font-size:15px;line-height:1.4;">
                <a href="product.html?id=${encodeURIComponent(p.id)}" data-open-prod="${escapeHtml(p.id)}">${escapeHtml(p.name)}</a>
              </h3>
              <div style="display:flex;align-items:center;gap:8px;">
                <strong style="color:#ff6b6b;font-size:16px;">${window.Store.formatPrice(p.price)}</strong>
                ${p.oldPrice ? `<span style="text-decoration:line-through;color:#7c899a;font-size:13px;">${window.Store.formatPrice(p.oldPrice)}</span>` : ""}
              </div>
              <div class="ds-card-actions">
                <button type="button" class="ds-btn ds-btn-primary" style="flex:1;" data-add-prod="${escapeHtml(p.id)}" ${p.stock <= 0 ? "disabled" : ""}>Add to Cart</button>
                <button type="button" class="ds-btn ds-btn-outline" title="Wishlist" data-wish-prod="${escapeHtml(p.id)}">${window.Store.isInWishlist(p.id) ? "♥" : "♡"}</button>
                <button type="button" class="ds-btn ds-btn-outline" title="Compare" data-cmp-prod="${escapeHtml(p.id)}">⇄</button>
              </div>
            </div>
          </div>`,
        )
        .join("");

      container.querySelectorAll("[data-open-prod]").forEach((a) => {
        a.addEventListener("click", (e) => {
          e.preventDefault();
          openProduct(a.getAttribute("data-open-prod"));
        });
      });
      container.querySelectorAll("[data-add-prod]").forEach((btn) => {
        btn.addEventListener("click", () =>
          window.Store.addToCart(btn.getAttribute("data-add-prod"), 1),
        );
      });
      container.querySelectorAll("[data-wish-prod]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const added = window.Store.toggleWishlist(
            btn.getAttribute("data-wish-prod"),
          );
          btn.textContent = added ? "♥" : "♡";
        });
      });
      container.querySelectorAll("[data-cmp-prod]").forEach((btn) => {
        btn.addEventListener("click", () =>
          window.Store.toggleCompare(btn.getAttribute("data-cmp-prod")),
        );
      });
    }

    [searchInput, categorySelect, sortSelect, priceRange, stockCheck].forEach(
      (el) => {
        if (el) el.addEventListener("input", renderGrid);
        if (el) el.addEventListener("change", renderGrid);
      },
    );

    const resetBtn = document.getElementById("shop-reset-filters");
    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        if (searchInput) searchInput.value = "";
        if (categorySelect) categorySelect.value = "all";
        if (sortSelect) sortSelect.value = "default";
        if (priceRange) priceRange.value = priceRange.max;
        if (stockCheck) stockCheck.checked = false;
        window.Store.setNavigationFilter({ q: "", category: "" });
        renderGrid();
      });
    }

    renderGrid();
    window.Store.subscribe(renderGrid);
  }

  // 9. صفحة المفضلة (wishlist.html)
  function initWishlistPage() {
    const root = document.getElementById("wishlist-page");
    if (!root) return;

    function render() {
      const ids = window.Store.getWishlist();
      const items = ids
        .map((id) => window.MockApi.getProductSync(id))
        .filter(Boolean);

      if (!items.length) {
        root.innerHTML = `
          <div class="container" style="padding:60px 15px;text-align:center;">
            <h2>Your Wishlist is Empty</h2>
            <p style="margin:12px 0 24px;color:#7c899a;">Save items you love to buy them later.</p>
            <a href="page-category.html" class="primary-button">Explore Products</a>
          </div>`;
        return;
      }

      root.innerHTML = `
        <div class="container" style="padding:40px 15px;">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;">
            <h1>My Wishlist (${items.length})</h1>
            <a href="page-category.html" class="ds-btn ds-btn-outline">Continue Shopping</a>
          </div>
          <div class="ds-grid">
            ${items
              .map(
                (p) => `
                <div class="ds-card">
                  <div class="ds-card-img">
                    <a href="product.html?id=${encodeURIComponent(p.id)}"><img src="${escapeHtml(p.image)}" alt="${escapeHtml(p.name)}" /></a>
                  </div>
                  <div class="ds-card-body">
                    <span style="font-size:12px;color:#7c899a;">${escapeHtml(p.category)}</span>
                    <h3 style="font-size:15px;">${escapeHtml(p.name)}</h3>
                    <strong style="color:#ff6b6b;font-size:16px;">${window.Store.formatPrice(p.price)}</strong>
                    <div class="ds-card-actions">
                      <button type="button" class="ds-btn ds-btn-primary" style="flex:1;" data-move-cart="${escapeHtml(p.id)}">Move to Cart</button>
                      <button type="button" class="ds-btn ds-btn-outline" data-rm-wish="${escapeHtml(p.id)}">Remove</button>
                    </div>
                  </div>
                </div>`,
              )
              .join("")}
          </div>
        </div>`;

      root.querySelectorAll("[data-move-cart]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const id = btn.getAttribute("data-move-cart");
          window.Store.addToCart(id, 1);
          window.Store.toggleWishlist(id);
        });
      });
      root.querySelectorAll("[data-rm-wish]").forEach((btn) => {
        btn.addEventListener("click", () =>
          window.Store.toggleWishlist(btn.getAttribute("data-rm-wish")),
        );
      });
    }

    render();
    window.Store.subscribe(render);
  }

  // 10. صفحة الحساب وتتبع الطلبات (account.html)
  function initAccountPage() {
    const root = document.getElementById("account-page");
    if (!root) return;

    const params = new URLSearchParams(window.location.search);
    let activeTab = params.get("tab") || "orders";
    const highlightOrder = params.get("order") || "";

    function render() {
      const user = window.Store.getCurrentUser();
      const orders = window.Store.getOrders();

      if (!user) {
        root.innerHTML = `
          <div class="container" style="padding:60px 15px;text-align:center;">
            <h2>Sign In to Access Your Account</h2>
            <p style="margin:12px 0 24px;color:#7c899a;">Track your orders, manage your profile, and view saved items.</p>
            <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;">
              <a href="sign-in.html" class="primary-button">Sign In / Register</a>
              <button type="button" id="ds-demo-login" class="ds-btn ds-btn-dark">Instant Demo Login</button>
            </div>
          </div>`;
        root.querySelector("#ds-demo-login")?.addEventListener("click", () => {
          window.Store.signIn("hossam@store.com", "123456");
        });
        return;
      }

      root.innerHTML = `
        <div class="container" style="padding:40px 15px;">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:16px;margin-bottom:24px;">
            <div>
              <h1>Welcome, ${escapeHtml(user.name)}</h1>
              <p style="color:#7c899a;font-size:14px;">${escapeHtml(user.email)} • Member ID: ${escapeHtml(user.id)}</p>
            </div>
            <button type="button" id="ds-logout-btn" class="ds-btn ds-btn-outline">Sign Out</button>
          </div>

          <div class="ds-tabs">
            <button type="button" class="ds-tab ${activeTab === "orders" ? "active" : ""}" data-tab="orders">My Orders & Tracking (${orders.length})</button>
            <button type="button" class="ds-tab ${activeTab === "profile" ? "active" : ""}" data-tab="profile">Profile & Address</button>
            <a href="wishlist.html" class="ds-tab">Wishlist (${window.Store.getWishlist().length})</a>
          </div>

          ${
            activeTab === "orders"
              ? `
              <div style="margin-bottom:24px;display:flex;gap:10px;max-width:460px;">
                <input type="text" id="ds-track-input" value="${escapeHtml(highlightOrder)}" placeholder="Enter Order ID (e.g. ORD-2026-8410)" style="flex:1;padding:10px 14px;border:1px solid #d1d5db;border-radius:8px;" />
                <button type="button" id="ds-track-btn" class="ds-btn ds-btn-dark">Track</button>
              </div>
              <div id="ds-track-result"></div>
              <div style="display:flex;flex-direction:column;gap:18px;">
                ${orders
                  .map((o) => {
                    const isDelivered = o.status
                      .toLowerCase()
                      .includes("delivered");
                    return `
                    <div class="ds-card" style="padding:20px;${o.id === highlightOrder ? "border:2px solid #ff6b6b;" : ""}">
                      <div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:10px;border-bottom:1px solid #e5e8ec;padding-bottom:12px;">
                        <div>
                          <strong>Order #${escapeHtml(o.id)}</strong>
                          <span style="color:#7c899a;font-size:13px;margin-left:10px;">Placed on ${escapeHtml(o.date)} • ${escapeHtml(o.paymentMethod || "Card")}</span>
                        </div>
                        <div>
                          <span class="ds-status-pill">${escapeHtml(o.status)}</span>
                          <strong style="margin-left:12px;font-size:16px;">${window.Store.formatPrice(o.total)}</strong>
                        </div>
                      </div>
                      <div class="ds-timeline">
                        <div class="ds-step done">1. Order Placed</div>
                        <div class="ds-step ${isDelivered ? "done" : "active"}">2. Confirmed & Packed</div>
                        <div class="ds-step ${isDelivered ? "done" : ""}">3. In Transit</div>
                        <div class="ds-step ${isDelivered ? "done" : ""}">4. Delivered</div>
                      </div>
                      <div style="display:flex;flex-direction:column;gap:8px;margin-top:8px;">
                        ${o.items
                          .map(
                            (it) => `
                            <div style="display:flex;align-items:center;gap:12px;">
                              <img src="${escapeHtml(it.image)}" alt="" style="width:48px;height:48px;border-radius:6px;object-fit:cover;" />
                              <div style="flex:1;">
                                <div style="font-weight:600;font-size:14px;">${escapeHtml(it.name)} ${it.variant ? `(${escapeHtml(it.variant)})` : ""}</div>
                                <div style="font-size:12px;color:#7c899a;">Qty: ${it.qty} × ${window.Store.formatPrice(it.price)}</div>
                              </div>
                            </div>`,
                          )
                          .join("")}
                      </div>
                    </div>`;
                  })
                  .join("")}
              </div>`
              : `
              <form id="ds-profile-form" style="max-width:520px;">
                <div class="ds-field"><label>Full Name</label><input type="text" name="name" value="${escapeHtml(user.name)}" required /></div>
                <div class="ds-field"><label>Email</label><input type="email" name="email" value="${escapeHtml(user.email)}" required /></div>
                <div class="ds-field"><label>Phone</label><input type="text" name="phone" value="${escapeHtml(user.phone || "")}" /></div>
                <div class="ds-field"><label>City</label><input type="text" name="city" value="${escapeHtml(user.city || "")}" /></div>
                <div class="ds-field"><label>Street Address</label><input type="text" name="address" value="${escapeHtml(user.address || "")}" /></div>
                <button type="submit" class="ds-btn ds-btn-primary">Save Changes</button>
              </form>`
          }
        </div>`;

      root
        .querySelector("#ds-logout-btn")
        ?.addEventListener("click", () => window.Store.signOut());

      root.querySelectorAll("[data-tab]").forEach((btn) => {
        btn.addEventListener("click", () => {
          activeTab = btn.getAttribute("data-tab");
          render();
        });
      });

      root.querySelector("#ds-track-btn")?.addEventListener("click", () => {
        const val = root.querySelector("#ds-track-input").value;
        const found = window.Store.getOrderById(val);
        const box = root.querySelector("#ds-track-result");
        if (!found) {
          box.innerHTML = `<p style="color:#dc2626;margin-bottom:16px;">No order found with ID "${escapeHtml(val)}".</p>`;
        } else {
          box.innerHTML = `<div style="padding:14px;background:#f0fdf4;border:1px solid #86efac;border-radius:8px;margin-bottom:16px;color:#166534;">
            <strong>${escapeHtml(found.id)}</strong> — Status: <strong>${escapeHtml(found.status)}</strong> • Destination: ${escapeHtml(found.customer?.city || "Registered Address")}
          </div>`;
        }
      });

      root
        .querySelector("#ds-profile-form")
        ?.addEventListener("submit", (e) => {
          e.preventDefault();
          const fd = new FormData(e.target);
          window.Store.updateProfile({
            name: fd.get("name"),
            email: fd.get("email"),
            phone: fd.get("phone"),
            city: fd.get("city"),
            address: fd.get("address"),
          });
        });
    }

    render();
    window.Store.subscribe(render);
  }

  // 11. صفحة تسجيل الدخول والتسجيل (sign-in.html)
  function initAuthPage() {
    const authRoot = document.getElementById("auth-page");
    if (!authRoot) return;

    let mode = "login";
    function render() {
      authRoot.innerHTML = `
        <div class="ds-auth-wrap">
          <div class="ds-tabs" style="justify-content:center;">
            <button type="button" class="ds-tab ${mode === "login" ? "active" : ""}" data-mode="login">Sign In</button>
            <button type="button" class="ds-tab ${mode === "register" ? "active" : ""}" data-mode="register">Create Account</button>
          </div>
          ${
            mode === "login"
              ? `
              <form id="ds-login-form">
                <div class="ds-field"><label>Email Address</label><input type="email" name="email" value="hossam@store.com" required /></div>
                <div class="ds-field"><label>Password</label><input type="password" name="password" value="123456" required /></div>
                <button type="submit" class="ds-btn ds-btn-primary" style="width:100%;">Sign In</button>
                <p style="margin-top:12px;font-size:12px;color:#7c899a;text-align:center;">Demo account ready (hossam@store.com / 123456)</p>
              </form>`
              : `
              <form id="ds-register-form">
                <div class="ds-field"><label>Full Name</label><input type="text" name="name" required /></div>
                <div class="ds-field"><label>Email Address</label><input type="email" name="email" required /></div>
                <div class="ds-field"><label>Password</label><input type="password" name="password" required /></div>
                <div class="ds-field"><label>City</label><input type="text" name="city" /></div>
                <button type="submit" class="ds-btn ds-btn-primary" style="width:100%;">Create Account</button>
              </form>`
          }
        </div>`;

      authRoot.querySelectorAll("[data-mode]").forEach((b) => {
        b.addEventListener("click", () => {
          mode = b.getAttribute("data-mode");
          render();
        });
      });

      authRoot
        .querySelector("#ds-login-form")
        ?.addEventListener("submit", (e) => {
          e.preventDefault();
          const fd = new FormData(e.target);
          const res = window.Store.signIn(fd.get("email"), fd.get("password"));
          if (!res.ok) return window.Store.toast(res.message);
          window.location.href = "account.html";
        });

      authRoot
        .querySelector("#ds-register-form")
        ?.addEventListener("submit", (e) => {
          e.preventDefault();
          const fd = new FormData(e.target);
          const res = window.Store.signUp({
            name: fd.get("name"),
            email: fd.get("email"),
            password: fd.get("password"),
            city: fd.get("city"),
          });
          if (!res.ok) return window.Store.toast(res.message);
          window.location.href = "account.html";
        });
    }

    render();
  }

  document.addEventListener("DOMContentLoaded", () => {
    ensureUnifiedChrome();
    window.Theme.init();
    initTemplateInteractions();
    wireGlobalNavigation();
    syncGlobalHeaderState();
    bindStaticProductCards();
    initCartPage();
    initCheckoutPage();
    initSingleProductPage();
    initCategoryPage();
    initWishlistPage();
    initAccountPage();
    initAuthPage();

    window.Store.subscribe(() => {
      syncGlobalHeaderState();
      bindStaticProductCards();
    });
  });
})();
