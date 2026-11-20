(() => {
  const KEY = "eraasoft_theme";
  const preferred = localStorage.getItem(KEY) || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

  function apply(theme) {
    document.documentElement.dataset.theme = theme;
    document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
      button.setAttribute("aria-label", theme === "dark" ? "Switch to light mode" : "Switch to dark mode");
      button.innerHTML = theme === "dark" ? '<i class="ri-sun-line"></i>' : '<i class="ri-moon-line"></i>';
    });
  }

  window.Theme = {
    get: () => document.documentElement.dataset.theme || preferred,
    set(theme) {
      localStorage.setItem(KEY, theme);
      apply(theme);
    },
    toggle() {
      window.Theme.set(window.Theme.get() === "dark" ? "light" : "dark");
    }
  };

  apply(preferred);
  document.addEventListener("DOMContentLoaded", () => {
    apply(window.Theme.get());
    document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
      button.addEventListener("click", (event) => {
        event.preventDefault();
        window.Theme.toggle();
      });
    });
  });
})();
