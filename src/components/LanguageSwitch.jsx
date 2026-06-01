export default function LanguageSwitch() {
  const handleLanguageChange = (language) => {
    window.siteI18n.setLanguage(language);
  };

  return (
    <div
      className="language-switch"
      data-i18n-aria-label="language.selector"
      aria-label="Language selector"
    >
      <button
        type="button"
        className="language-switch__button"
        data-language-button="en"
        aria-pressed="false"
        onClick={() => handleLanguageChange("en")}
      >
        English
      </button>
      <button
        type="button"
        className="language-switch__button"
        data-language-button="hu"
        aria-pressed="false"
        onClick={() => handleLanguageChange("hu")}
      >
        Magyar
      </button>
      <button
        type="button"
        className="language-switch__button"
        data-language-button="ro"
        aria-pressed="false"
        onClick={() => handleLanguageChange("ro")}
      >
        Română
      </button>
    </div>
  );
}
