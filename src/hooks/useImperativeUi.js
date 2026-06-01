import { useEffect } from "react";
import { renderKeyFacts } from "../../modules/features/key-facts.js";
import { renderCountryExplorer } from "../../modules/features/country-explorer.js";
import { embedCharts } from "../../modules/features/charts.js";
import { renderDashboard } from "../../modules/features/dashboard.js";

async function rerenderLocalizedUi() {
  renderKeyFacts();
  renderCountryExplorer();
  await embedCharts();
  renderDashboard();
}

export function useImperativeUi() {
  useEffect(() => {
    let resizeRerenderTimeout = null;

    rerenderLocalizedUi();

    const rerenderForLanguage = () => {
      rerenderLocalizedUi();
    };

    window.siteI18n.subscribe(rerenderForLanguage);

    const handleResize = () => {
      window.clearTimeout(resizeRerenderTimeout);
      resizeRerenderTimeout = window.setTimeout(() => {
        rerenderLocalizedUi();
      }, 140);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.clearTimeout(resizeRerenderTimeout);
    };
  }, []);
}
