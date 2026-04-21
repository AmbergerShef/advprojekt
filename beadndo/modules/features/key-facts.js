import { BENCHMARK_COUNTRY, PROFILE_FOCUS_COUNTRIES } from "../core/constants.js";
import { countryLabel, t } from "../core/i18n.js";

function highestRenewableValue(row) {
  return Number(row.renewable_share_percent).toFixed(1);
}

export function renderKeyFacts() {
  const cards = {
    waste: {
      label: document.querySelector("#stat-waste-label"),
      value: document.querySelector("#stat-waste-value"),
      note: document.querySelector("#stat-waste-note")
    },
    recycling: {
      label: document.querySelector("#stat-recycling-label"),
      value: document.querySelector("#stat-recycling-value"),
      note: document.querySelector("#stat-recycling-note")
    },
    renewable: {
      label: document.querySelector("#stat-renewable-label"),
      value: document.querySelector("#stat-renewable-value"),
      note: document.querySelector("#stat-renewable-note")
    },
    focus: {
      label: document.querySelector("#stat-focus-label"),
      value: document.querySelector("#stat-focus-value"),
      note: document.querySelector("#stat-focus-note")
    }
  };

  if (Object.values(cards).some((card) => !card.label || !card.value || !card.note)) {
    return;
  }

  const highestWaste = [...window.chartData.municipalWastePerCapita].sort(
    (left, right) => right.waste_kg_per_capita - left.waste_kg_per_capita
  )[0];
  const highestRecycling = [...window.chartData.wasteTreatmentComparison]
    .filter((row) => row.treatment_type === "Recycling")
    .sort((left, right) => right.share_percent - left.share_percent)[0];

  const latestRenewable = {};
  for (const row of window.chartData.renewableEnergyShare) {
    if (row.country === BENCHMARK_COUNTRY) {
      continue;
    }
    if (!latestRenewable[row.country] || row.year > latestRenewable[row.country].year) {
      latestRenewable[row.country] = row;
    }
  }

  const renewableLeader = Object.values(latestRenewable).sort(
    (left, right) => right.renewable_share_percent - left.renewable_share_percent
  )[0];

  const focusTreatment = window.chartData.wasteTreatmentComparison.filter((row) =>
    PROFILE_FOCUS_COUNTRIES.includes(row.country)
  );
  const romaniaLandfill = focusTreatment.find(
    (row) => row.country === "Romania" && row.treatment_type === "Landfill"
  );
  const hungaryLandfill = focusTreatment.find(
    (row) => row.country === "Hungary" && row.treatment_type === "Landfill"
  );

  cards.waste.label.textContent = t("dynamic.highestWasteLabel");
  cards.waste.value.textContent = `${highestWaste.waste_kg_per_capita} ${t("units.kgPerCapita")}`;
  cards.waste.note.textContent = `${countryLabel(highestWaste.country)}, ${highestWaste.year}.`;

  cards.recycling.label.textContent = t("dynamic.strongestRecyclingLabel");
  cards.recycling.value.textContent = `${highestRecycling.share_percent}%`;
  cards.recycling.note.textContent = `${countryLabel(highestRecycling.country)}, ${highestRecycling.year}.`;

  cards.renewable.label.textContent = t("dynamic.highestRenewableLabel");
  cards.renewable.value.textContent = `${highestRenewableValue(renewableLeader)}%`;
  cards.renewable.note.textContent = `${countryLabel(renewableLeader.country)}, ${renewableLeader.year}.`;

  cards.focus.label.textContent = t("dynamic.focusLabel");
  if (romaniaLandfill && hungaryLandfill) {
    cards.focus.value.textContent = `${romaniaLandfill.share_percent}% vs ${hungaryLandfill.share_percent}%`;
    cards.focus.note.textContent = t("dynamic.landfillNote");
  } else {
    cards.focus.value.textContent = "—";
    cards.focus.note.textContent = t("dynamic.notAvailable");
  }
}
