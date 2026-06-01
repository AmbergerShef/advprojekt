import { PROFILE_FOCUS_COUNTRIES, BENCHMARK_COUNTRY } from "../core/constants.js";
import { countryLabel, t } from "../core/i18n.js";
import { formatValue } from "../core/utils.js";

function buildCountryProfiles() {
  const treatmentByCountry = {};
  for (const row of window.chartData.wasteTreatmentComparison) {
    if (!treatmentByCountry[row.country]) {
      treatmentByCountry[row.country] = {};
    }
    treatmentByCountry[row.country][row.treatment_type] = row.share_percent;
  }

  const renewableByCountry = {};
  for (const row of window.chartData.renewableEnergyShare) {
    if (
      row.country !== BENCHMARK_COUNTRY &&
      (!renewableByCountry[row.country] || row.year > renewableByCountry[row.country].year)
    ) {
      renewableByCountry[row.country] = row;
    }
  }

  const circularByCountry = {};
  for (const row of window.chartData.circularVsRecycling) {
    circularByCountry[row.country] = row;
  }

  const ghgByCountry = {};
  for (const row of window.chartData.ghgPerCapita) {
    ghgByCountry[row.country] = row;
  }

  const energyByCountry = {};
  for (const row of window.chartData.energyRecoveryOverTime) {
    if (
      row.country !== BENCHMARK_COUNTRY &&
      (!energyByCountry[row.country] || row.year > energyByCountry[row.country].year)
    ) {
      energyByCountry[row.country] = row;
    }
  }

  return window.chartData.municipalWastePerCapita
    .map((row) => {
      const treatment = treatmentByCountry[row.country] || {};
      const renewable = renewableByCountry[row.country] || null;
      const circular = circularByCountry[row.country] || null;
      const ghg = ghgByCountry[row.country] || null;
      const energy = energyByCountry[row.country] || null;

      return {
        country: row.country,
        waste: row.waste_kg_per_capita,
        year: row.year,
        recycling: treatment.Recycling,
        landfill: treatment.Landfill,
        energyRecoveryShare: treatment["Incineration with energy recovery"],
        renewable: renewable ? renewable.renewable_share_percent : null,
        renewableYear: renewable ? renewable.year : null,
        circularity: circular ? circular.circular_material_use_rate_percent : null,
        circularityYear: circular ? circular.year : null,
        municipalRecycling: circular ? circular.recycling_rate_percent : null,
        ghg: ghg ? ghg.ghg_tonnes_per_capita : null,
        ghgYear: ghg ? ghg.year : null,
        energyRecoveryLevel: energy ? energy.energy_recovery_kg_per_capita : null,
        energyRecoveryYear: energy ? energy.year : null
      };
    })
    .sort((left, right) => left.country.localeCompare(right.country));
}

function metricCard(label, value, note) {
  return `
    <article class="profile-metric-card">
      <p class="profile-metric-card__label">${label}</p>
      <p class="profile-metric-card__value">${value}</p>
      <p class="profile-metric-card__note">${note}</p>
    </article>
  `;
}

function buildProfileNarrative(profile) {
  const landfill = profile.landfill ?? 0;
  const recycling = profile.recycling ?? 0;
  const energy = profile.energyRecoveryShare ?? 0;

  let systemType = t("dynamic.mixedSystem");
  if (landfill <= 2 && energy >= 35) {
    systemType = t("dynamic.lowLandfillSystem");
  } else if (recycling >= 50 && landfill < 20) {
    systemType = t("dynamic.recyclingLedSystem");
  } else if (landfill >= 30) {
    systemType = t("dynamic.landfillReliantSystem");
  }

  const renewableSentence =
    profile.renewable !== null
      ? t("dynamic.renewableSentence", {
          country: countryLabel(profile.country),
          year: profile.renewableYear,
          value: formatValue(profile.renewable, "%")
        })
      : t("dynamic.renewableUnavailable", {
          country: countryLabel(profile.country)
        });

  return `
    <p>${t("dynamic.profileParagraph1", {
      country: countryLabel(profile.country),
      systemType,
      recycling: formatValue(profile.recycling, "%"),
      landfill: formatValue(profile.landfill, "%"),
      energy: formatValue(profile.energyRecoveryShare, "%")
    })}</p>
    <p>${renewableSentence}</p>
  `;
}

export function renderCountryExplorer() {
  const select = document.querySelector("#country-profile-select");
  const countryName = document.querySelector("#profile-country-name");
  const metrics = document.querySelector("#profile-metrics");
  const note = document.querySelector("#profile-note");
  const rankingTitle = document.querySelector("#ranking-table-title");
  const rankingBody = document.querySelector("#ranking-table-body");

  if (!select || !countryName || !metrics || !note || !rankingBody || !rankingTitle) {
    return;
  }

  const profiles = buildCountryProfiles();
  const selectedCountry =
    select.value || PROFILE_FOCUS_COUNTRIES[0] || profiles[0]?.country || "";

  select.innerHTML = "";
  for (const profile of profiles) {
    const option = document.createElement("option");
    option.value = profile.country;
    option.textContent = countryLabel(profile.country);
    option.selected = profile.country === selectedCountry;
    select.append(option);
  }

  rankingTitle.textContent = t("dynamic.rankingTableTitle");

  const rankingRows = [...profiles]
    .sort((left, right) => left.landfill - right.landfill)
    .map(
      (profile) => `
        <tr class="${PROFILE_FOCUS_COUNTRIES.includes(profile.country) ? "ranking-row ranking-row--focus" : "ranking-row"}">
          <td>${countryLabel(profile.country)}</td>
          <td>${formatValue(profile.waste, ` ${t("units.kgPerCapita")}`, 0)}</td>
          <td>${formatValue(profile.recycling, "%")}</td>
          <td>${formatValue(profile.landfill, "%")}</td>
          <td>${formatValue(profile.ghg, ` ${t("units.ghgPerCapita")}`)}</td>
        </tr>
      `
    )
    .join("");

  rankingBody.innerHTML = rankingRows;

  function updateProfile(country) {
    const profile = profiles.find((item) => item.country === country) || profiles[0];
    if (!profile) {
      return;
    }

    select.value = profile.country;
    countryName.textContent = countryLabel(profile.country);
    metrics.innerHTML = [
      metricCard(
        t("dynamic.wasteGeneration"),
        formatValue(profile.waste, ` ${t("units.kgPerCapita")}`, 0),
        t("dynamic.wasteGenerationNote", { year: profile.year })
      ),
      metricCard(
        t("dynamic.recyclingShare"),
        formatValue(profile.recycling, "%"),
        t("dynamic.recyclingShareNote")
      ),
      metricCard(
        t("dynamic.landfillShare"),
        formatValue(profile.landfill, "%"),
        t("dynamic.landfillShareNote")
      ),
      metricCard(
        t("dynamic.energyRecovery"),
        formatValue(profile.energyRecoveryLevel, ` ${t("units.kgPerCapita")}`, 0),
        profile.energyRecoveryYear
          ? t("dynamic.energyRecoveryNote", { year: profile.energyRecoveryYear })
          : t("dynamic.notAvailable")
      ),
      metricCard(
        t("dynamic.circularity"),
        formatValue(profile.circularity, "%"),
        profile.circularityYear
          ? t("dynamic.circularityNote", { year: profile.circularityYear })
          : t("dynamic.circularityUnavailable")
      ),
      metricCard(
        t("dynamic.ghgContext"),
        formatValue(profile.ghg, ` ${t("units.ghgPerCapita")}`),
        profile.ghgYear
          ? t("dynamic.ghgContextNote", { year: profile.ghgYear })
          : t("dynamic.ghgUnavailable")
      )
    ].join("");

    note.innerHTML = buildProfileNarrative(profile);
  }

  select.onchange = (event) => {
    updateProfile(event.target.value);
  };

  updateProfile(selectedCountry);
}
