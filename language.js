(function () {
  const STORAGE_KEY = "siteLanguage";
  const SUPPORTED_LANGUAGES = ["hu", "en", "ro"];

  const normalizeLanguage = (lang) =>
    SUPPORTED_LANGUAGES.includes(lang) ? lang : "hu";

  const getCurrentLanguage = () => normalizeLanguage(localStorage.getItem(STORAGE_KEY) || "hu");

  const updateButtons = (lang) => {
    document.querySelectorAll(".lang-btn").forEach((button) => {
      button.classList.toggle("active", button.dataset.lang === lang);
    });
  };

  const setCurrentLanguage = (lang) => {
    const normalized = normalizeLanguage(lang);
    localStorage.setItem(STORAGE_KEY, normalized);
    document.documentElement.lang = normalized;
    updateButtons(normalized);
    window.dispatchEvent(
      new CustomEvent("site-language-change", {
        detail: { lang: normalized }
      })
    );
  };

  const initializeLanguageSwitcher = () => {
    const current = getCurrentLanguage();
    document.documentElement.lang = current;
    updateButtons(current);

    document.querySelectorAll(".lang-btn").forEach((button) => {
      button.addEventListener("click", () => {
        setCurrentLanguage(button.dataset.lang);
      });
    });
  };

  window.SiteLanguage = {
    getCurrentLanguage,
    setCurrentLanguage,
    initializeLanguageSwitcher
  };
})();
