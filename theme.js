(function () {
  const THEME_KEY = "dotstore_theme_v1";

  window.Theme = {
    init() {
      this.injectStyles();
      this.applySavedTheme();
      this.initCountdown();
      this.initStockBars();
      this.initBackToTop();
    },

    injectStyles() {
      if (document.getElementById("dotstore-dynamic-styles")) return;
      const style = document.createElement("style");
      style.id = "dotstore-dynamic-styles";
      style.textContent = `
        /* إصلاح خطأ .righ في القالب الأصلي ليتطابق مع .right */
        .header-nav .righ { margin-left: auto; }
        .header-nav .righ .second-links { gap: 1.5em; }

        /* الوضع الليلي المتكامل */
        body.dark-theme { background-color: #11131a; color: #e5e7eb; }
        body.dark-theme header, body.dark-theme .header-top, body.dark-theme .header-nav,
        body.dark-theme .header-main, body.dark-theme .mini-cart, body.dark-theme .dpt-menu,
        body.dark-theme .mega, body.dark-theme .widgets, body.dark-theme .footer-info,
        body.dark-theme .cart-summary.styled, body.dark-theme .checkout .item.left.styled,
        body.dark-theme .ds-card, body.dark-theme .ds-auth-wrap, body.dark-theme .menu-bottom,
        body.dark-theme .off-canvas, body.dark-theme .search-bottom { background-color: #1a1d27 !important; color: #e5e7eb !important; border-color: #2c3142 !important; }
        body.dark-theme a, body.dark-theme h1, body.dark-theme h2, body.dark-theme h3, body.dark-theme h4, body.dark-theme th, body.dark-theme td, body.dark-theme label { color: #f3f4f6; }
        body.dark-theme input, body.dark-theme select, body.dark-theme textarea { background-color: #11131a !important; color: #fff !important; border-color: #374151 !important; }
        body.dark-theme .summary-order.is_sticky { background-color: #1a1d27 !important; border: 1px solid #2c3142; }

        /* حالات الأزرار التفاعلية */
        .hoverable li.is-wishlisted a { background-color: #ff6b6b !important; color: #fff !important; opacity: 1 !important; }
        .hoverable li.is-compared a { background-color: #0a021c !important; color: #fff !important; opacity: 1 !important; }
        .ds-card-quick-add { margin-top: 10px; width: 100%; padding: 8px 14px; border-radius: 20px; border: 1px solid #e5e8ec; background: #f8f9fa; color: #0a021c; font-weight: 600; font-size: 12px; cursor: pointer; transition: .2s; }
        .ds-card-quick-add:hover { background: #ff6b6b; color: #fff; border-color: #ff6b6b; }
        body.dark-theme .ds-card-quick-add { background: #252936; color: #fff; border-color: #374151; }
        body.dark-theme .ds-card-quick-add:hover { background: #ff6b6b; border-color: #ff6b6b; }

        /* البطاقات والشبكة الموحدة */
        .ds-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(235px, 1fr)); gap: 24px; margin-top: 24px; }
        .ds-card { background: #fff; border: 1px solid #e5e8ec; border-radius: 10px; overflow: hidden; display: flex; flex-direction: column; transition: transform .2s, box-shadow .2s; }
        .ds-card:hover { transform: translateY(-4px); box-shadow: 0 12px 24px rgba(0,0,0,.08); }
        .ds-card-img { position: relative; height: 220px; overflow: hidden; background: #f8f9fa; }
        .ds-card-img img { width: 100%; height: 100%; object-fit: cover; transition: transform .3s; }
        .ds-card:hover .ds-card-img img { transform: scale(1.04); }
        .ds-card-body { padding: 16px; display: flex; flex-direction: column; gap: 8px; flex: 1; }
        .ds-card-actions { display: flex; gap: 8px; margin-top: auto; padding-top: 10px; }
        .ds-btn { padding: 10px 16px; border-radius: 25px; border: none; cursor: pointer; font-weight: 600; font-size: 13px; transition: .2s; text-align: center; display: inline-flex; align-items: center; justify-content: center; gap: 6px; }
        .ds-btn-primary { background: #ff6b6b; color: #fff; }
        .ds-btn-primary:hover { background: #0a021c; color: #fff; }
        .ds-btn-dark { background: #0a021c; color: #fff; }
        .ds-btn-dark:hover { background: #ff6b6b; color: #fff; }
        .ds-btn-outline { background: transparent; border: 1px solid #d1d5db; color: inherit; }
        .ds-btn-outline:hover { border-color: #ff6b6b; color: #ff6b6b; }
        .ds-tabs { display: flex; gap: 10px; flex-wrap: wrap; border-bottom: 1px solid #e5e8ec; padding-bottom: 12px; margin-bottom: 24px; }
        .ds-tab { padding: 8px 18px; border-radius: 20px; border: 1px solid #e5e8ec; background: transparent; cursor: pointer; font-weight: 600; }
        .ds-tab.active { background: #ff6b6b; color: #fff; border-color: #ff6b6b; }

        /* النوافذ المنبثقة وشريط المقارنة */
        .ds-modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,.65); z-index: 9998; display: flex; align-items: center; justify-content: center; padding: 16px; }
        .ds-modal-box { background: #fff; color: #0a021c; max-width: 820px; width: 100%; border-radius: 12px; padding: 24px; position: relative; max-height: 90vh; overflow-y: auto; }
        body.dark-theme .ds-modal-box { background: #1a1d27; color: #fff; }
        .ds-compare-bar { position: fixed; bottom: 0; left: 0; right: 0; background: #0a021c; color: #fff; z-index: 9990; padding: 12px 20px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; box-shadow: 0 -6px 20px rgba(0,0,0,.25); }
        .ds-status-pill { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 700; background: #dcfce7; color: #166534; }
        .ds-auth-wrap { max-width: 480px; margin: 40px auto; padding: 32px; border: 1px solid #e5e8ec; border-radius: 12px; background: #fff; }
        .ds-field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 16px; }
        .ds-field input, .ds-field select, .ds-field textarea { padding: 11px 14px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 14px; width: 100%; }

        /* ألوان وخيارات المنتج النشطة */
        .ds-swatch-btn { padding: 6px 14px; border-radius: 20px; border: 1px solid #d1d5db; background: transparent; cursor: pointer; font-size: 12px; font-weight: 600; transition: .2s; }
        .ds-swatch-btn.active { background: #0a021c; color: #fff; border-color: #0a021c; }
        body.dark-theme .ds-swatch-btn.active { background: #ff6b6b; border-color: #ff6b6b; }
        .ds-thumb-strip { display: flex; gap: 10px; margin-top: 12px; }
        .ds-thumb-strip img { width: 68px; height: 68px; object-fit: cover; border-radius: 8px; border: 2px solid transparent; cursor: pointer; }
        .ds-thumb-strip img.active { border-color: #ff6b6b; }

        /* شريط تتبع الطلب */
        .ds-timeline { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin: 14px 0; }
        .ds-step { text-align: center; padding: 8px 6px; border-radius: 8px; font-size: 11px; font-weight: 700; background: #f3f4f6; color: #6b7280; }
        .ds-step.done { background: #dcfce7; color: #166534; }
        .ds-step.active { background: #ff6b6b; color: #fff; }
        body.dark-theme .ds-step { background: #252936; color: #9ca3af; }
        body.dark-theme .ds-step.done { background: #14532d; color: #bbf7d0; }

        /* تقييم النجوم في النموذج */
        .rate-this { display: flex; flex-direction: row-reverse; justify-content: flex-end; gap: 4px; }
        .rate-this input { display: none; }
        .rate-this label { cursor: pointer; font-size: 20px; color: #d1d5db; }
        .rate-this input:checked ~ label, .rate-this label:hover, .rate-this label:hover ~ label { color: #f59e0b; }

        @media (max-width: 640px) {
          .ds-timeline { grid-template-columns: repeat(2, 1fr); }
        }
      `;
      document.head.appendChild(style);
    },

    applySavedTheme() {
      if (sessionStorage.getItem(THEME_KEY) === "dark") {
        document.body.classList.add("dark-theme");
      }
    },

    toggleTheme() {
      const isDark = document.body.classList.toggle("dark-theme");
      sessionStorage.setItem(THEME_KEY, isDark ? "dark" : "light");
    },

    initCountdown() {
      const offerList = document.querySelector(".offer ul");
      if (!offerList) return;
      const items = offerList.querySelectorAll("li");
      if (items.length < 4) return;

      let totalSeconds = 1 * 86400 + 15 * 3600 + 27 * 60 + 59;
      setInterval(() => {
        if (totalSeconds <= 0) return;
        totalSeconds--;
        const d = Math.floor(totalSeconds / 86400);
        const h = Math.floor((totalSeconds % 86400) / 3600);
        const m = Math.floor((totalSeconds % 3600) / 60);
        const s = totalSeconds % 60;
        items[0].textContent = String(d);
        items[1].textContent = String(h).padStart(2, "0");
        items[2].textContent = String(m).padStart(2, "0");
        items[3].textContent = String(s).padStart(2, "0");
      }, 1000);
    },

    initStockBars() {
      document.querySelectorAll(".stock").forEach((stockEl) => {
        const availEl = stockEl.querySelector(".qty-available");
        const soldEl = stockEl.querySelector(".qty-sold");
        const barEl = stockEl.querySelector(".bar .available");
        if (!availEl || !soldEl || !barEl) return;
        const avail = parseFloat(availEl.textContent.replace(/,/g, "")) || 100;
        const sold = parseFloat(soldEl.textContent.replace(/[.,]/g, "")) || 300;
        const pct = Math.min(
          100,
          Math.max(5, Math.round((avail / (avail + sold)) * 100)),
        );
        barEl.style.width = pct + "%";
      });
    },

    initBackToTop() {
      const btn = document.querySelector(".backtotop a");
      if (!btn) return;
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    },
  };
})();
