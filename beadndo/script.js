/* global chartData, vegaEmbed, chartConfigs, siteI18n */

const PROFILE_FOCUS_COUNTRIES = ["Romania", "Hungary"];
const BENCHMARK_COUNTRY = "EU average";
const chartRuntimeStates = new Map();

let dashboardRuntimeState = null;
let resizeRerenderTimeout = null;

const DASHBOARD_INDICATORS = [
  { key: "municipal_waste_per_capita", unitKey: "units.kgPerCapita", decimals: 0 },
  { key: "recycling_share", unitKey: "units.percent", decimals: 1 },
  { key: "landfill_share", unitKey: "units.percent", decimals: 1 },
  { key: "energy_recovery_share", unitKey: "units.percent", decimals: 1 },
  { key: "renewable_energy_share", unitKey: "units.percent", decimals: 1 },
  { key: "circular_material_use_rate", unitKey: "units.percent", decimals: 1 },
  { key: "ghg_per_capita", unitKey: "units.ghgPerCapita", decimals: 1 },
  { key: "energy_recovery_level", unitKey: "units.kgPerCapita", decimals: 0 }
];

const dashboardIndicatorMap = Object.fromEntries(
  DASHBOARD_INDICATORS.map((indicator) => [indicator.key, indicator])
);

function t(path, params = {}) {
  return siteI18n.t(path, params);
}

function countryLabel(name) {
  return siteI18n.country(name);
}

function indicatorLabel(indicatorKey) {
  return t(`dashboardIndicators.${indicatorKey}`);
}

function unitLabel(unitKey) {
  return t(unitKey);
}

function treatmentLabel(value) {
  if (value === "Recycling") {
    return t("charts.treatment.recycling");
  }
  if (value === "Landfill") {
    return t("charts.treatment.landfill");
  }
  if (value === "Incineration with energy recovery") {
    return t("charts.treatment.energy");
  }
  return value;
}

function cloneState(state) {
  return JSON.parse(JSON.stringify(state));
}

function clampValue(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function getResponsiveChartWidth(container, options = {}) {
  const viewportWidth = window.innerWidth || document.documentElement.clientWidth || 1280;
  const framePadding = options.framePadding ?? (viewportWidth <= 480 ? 20 : viewportWidth <= 700 ? 24 : 28);
  const availableWidth = Math.max((container?.clientWidth || 0) - framePadding, 0);

  if (availableWidth === 0) {
    return options.fallbackWidth ?? 640;
  }

  const minWidth = options.minWidth ?? (viewportWidth <= 480 ? 260 : viewportWidth <= 700 ? 300 : 420);
  const maxWidth = options.maxWidth ?? Math.max(availableWidth, minWidth);
  return clampValue(availableWidth, minWidth, maxWidth);
}

function applyResponsiveChartSpec(spec, container, options = {}) {
  const width = getResponsiveChartWidth(container, options);
  const isCompactViewport = window.innerWidth <= 700;
  const isTabletViewport = window.innerWidth <= 1024;
  const defaultPadding = isCompactViewport
    ? { left: 6, right: 12, top: 8, bottom: 6 }
    : isTabletViewport
      ? { left: 8, right: 14, top: 10, bottom: 8 }
      : { left: 10, right: 16, top: 12, bottom: 10 };

  return {
    ...spec,
    width,
    autosize: {
      type: "fit-x",
      contains: "padding"
    },
    padding: spec.padding || defaultPadding,
    config: {
      ...(spec.config || {}),
      axis: {
        ...(spec.config?.axis || {}),
        labelLimit: isCompactViewport ? 120 : isTabletViewport ? 180 : 260,
        titleLimit: isCompactViewport ? 180 : isTabletViewport ? 240 : 320,
        labelBound: true,
        titlePadding: isCompactViewport ? 10 : 12
      },
      legend: {
        ...(spec.config?.legend || {}),
        orient: isCompactViewport ? "bottom" : spec.config?.legend?.orient,
        direction: isCompactViewport ? "horizontal" : spec.config?.legend?.direction,
        labelLimit: isCompactViewport ? 96 : 150,
        titleLimit: isCompactViewport ? 120 : 180
      },
      title: {
        ...(spec.config?.title || {}),
        fontSize: isCompactViewport ? 16 : isTabletViewport ? 18 : 20,
        limit: width,
        lineHeight: isCompactViewport ? 20 : 24
      }
    }
  };
}

function formatValue(value, suffix = "", digits = 1) {
  if (value === null || value === undefined) {
    return t("dynamic.notAvailable");
  }

  return `${Number(value).toFixed(digits)}${suffix}`;
}

function formatDashboardValue(row) {
  const unit = unitLabel(row.unitKey);
  return `${Number(row.value).toFixed(row.decimals)} ${unit}`;
}

function selectedValues(select) {
  return Array.from(select.selectedOptions).map((option) => option.value);
}

function setMultiSelectValues(select, values) {
  const selected = new Set(values);
  Array.from(select.options).forEach((option) => {
    option.selected = selected.has(option.value);
  });
}

function selectionSummary(selectedCount, totalCount, nounKey) {
  const noun = t(`dynamic.${nounKey}`);

  if (selectedCount === 0) {
    return t("dynamic.noneSelected", { noun });
  }

  if (selectedCount === totalCount) {
    return t("dynamic.allSelected", { noun });
  }

  return t("dynamic.selectedCount", {
    selected: selectedCount,
    total: totalCount,
    noun
  });
}

function createActionButton(label, onClick) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "filter-action-button";
  button.textContent = label;
  button.addEventListener("click", onClick);
  return button;
}

function createActionRow(buttons) {
  const row = document.createElement("div");
  row.className = "filter-actions";
  buttons.forEach((button) => row.append(button));
  return row;
}

function createFilterMeta(labelText, defaultText) {
  const meta = document.createElement("div");
  meta.className = "filter-meta";

  const label = document.createElement("label");
  label.className = "filter-meta__label";
  label.textContent = labelText;

  const status = document.createElement("p");
  status.className = "filter-meta__status";
  status.textContent = defaultText;

  meta.append(label, status);
  return { meta, status };
}

function createCheckboxPicker({
  labelText,
  options,
  selected,
  nounKey,
  defaultMessage,
  onChange,
  formatOption = (value) => value
}) {
  const wrapper = document.createElement("div");
  wrapper.className = "filter-picker";

  const { meta, status } = createFilterMeta(labelText, defaultMessage);
  const details = document.createElement("details");
  details.className = "filter-picker__details";

  const summary = document.createElement("summary");
  summary.className = "filter-picker__summary";

  const summaryText = document.createElement("span");
  summaryText.className = "filter-picker__summary-text";

  const summaryState = document.createElement("span");
  summaryState.className = "filter-picker__summary-state";

  summary.append(summaryText, summaryState);

  const panel = document.createElement("div");
  panel.className = "filter-picker__panel";

  const list = document.createElement("div");
  list.className = "filter-picker__list";

  function getCheckedValues() {
    return Array.from(list.querySelectorAll("input:checked")).map((element) => element.value);
  }

  function refreshDisclosureLabel() {
    summaryState.textContent = details.open ? t("dynamic.closePicker") : t("dynamic.openPicker");
  }

  function updateTexts(values) {
    const summaryTextValue = selectionSummary(values.length, options.length, nounKey);
    status.textContent = summaryTextValue;
    summaryText.textContent = summaryTextValue;
    refreshDisclosureLabel();
  }

  function sync(values) {
    const selectedSet = new Set(values);
    Array.from(list.querySelectorAll("input")).forEach((input) => {
      input.checked = selectedSet.has(input.value);
    });
    updateTexts(values);
  }

  for (const optionValue of options) {
    const itemLabel = document.createElement("label");
    itemLabel.className = "filter-picker__item chart-check";

    const input = document.createElement("input");
    input.type = "checkbox";
    input.value = optionValue;
    input.checked = selected.includes(optionValue);
    input.addEventListener("change", () => {
      const nextValues = getCheckedValues();
      updateTexts(nextValues);
      onChange(nextValues);
    });

    const text = document.createElement("span");
    text.textContent = formatOption(optionValue);

    itemLabel.append(input, text);
    list.append(itemLabel);
  }

  details.addEventListener("toggle", refreshDisclosureLabel);

  const allButton = createActionButton(t("dynamic.selectAll"), () => {
    const values = options.slice();
    sync(values);
    onChange(values);
  });

  const clearButton = createActionButton(t("dynamic.clearAll"), () => {
    sync([]);
    onChange([]);
  });

  panel.append(createActionRow([allButton, clearButton]), list);
  details.append(summary, panel);
  wrapper.append(meta, details);
  sync(selected);

  return {
    element: wrapper,
    setSelected: sync
  };
}

function renderKeyFacts() {
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

  const highestWaste = [...chartData.municipalWastePerCapita].sort(
    (left, right) => right.waste_kg_per_capita - left.waste_kg_per_capita
  )[0];
  const highestRecycling = [...chartData.wasteTreatmentComparison]
    .filter((row) => row.treatment_type === "Recycling")
    .sort((left, right) => right.share_percent - left.share_percent)[0];

  const latestRenewable = {};
  for (const row of chartData.renewableEnergyShare) {
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

  const focusTreatment = chartData.wasteTreatmentComparison.filter((row) =>
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

function highestRenewableValue(row) {
  return Number(row.renewable_share_percent).toFixed(1);
}

function buildCountryProfiles() {
  const treatmentByCountry = {};
  for (const row of chartData.wasteTreatmentComparison) {
    if (!treatmentByCountry[row.country]) {
      treatmentByCountry[row.country] = {};
    }
    treatmentByCountry[row.country][row.treatment_type] = row.share_percent;
  }

  const renewableByCountry = {};
  for (const row of chartData.renewableEnergyShare) {
    if (
      row.country !== BENCHMARK_COUNTRY &&
      (!renewableByCountry[row.country] || row.year > renewableByCountry[row.country].year)
    ) {
      renewableByCountry[row.country] = row;
    }
  }

  const circularByCountry = {};
  for (const row of chartData.circularVsRecycling) {
    circularByCountry[row.country] = row;
  }

  const ghgByCountry = {};
  for (const row of chartData.ghgPerCapita) {
    ghgByCountry[row.country] = row;
  }

  const energyByCountry = {};
  for (const row of chartData.energyRecoveryOverTime) {
    if (
      row.country !== BENCHMARK_COUNTRY &&
      (!energyByCountry[row.country] || row.year > energyByCountry[row.country].year)
    ) {
      energyByCountry[row.country] = row;
    }
  }

  return chartData.municipalWastePerCapita
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

function renderCountryExplorer() {
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

function buildDashboardDataset() {
  const rows = [];

  for (const row of chartData.municipalWastePerCapita) {
    rows.push({
      country: row.country,
      year: row.year,
      indicatorKey: "municipal_waste_per_capita",
      value: row.waste_kg_per_capita,
      unitKey: dashboardIndicatorMap.municipal_waste_per_capita.unitKey,
      decimals: dashboardIndicatorMap.municipal_waste_per_capita.decimals
    });
  }

  for (const row of chartData.wasteTreatmentComparison) {
    const indicatorKey =
      row.treatment_type === "Recycling"
        ? "recycling_share"
        : row.treatment_type === "Landfill"
          ? "landfill_share"
          : "energy_recovery_share";

    rows.push({
      country: row.country,
      year: row.year,
      indicatorKey,
      value: row.share_percent,
      unitKey: dashboardIndicatorMap[indicatorKey].unitKey,
      decimals: dashboardIndicatorMap[indicatorKey].decimals
    });
  }

  for (const row of chartData.renewableEnergyShare) {
    if (row.country === BENCHMARK_COUNTRY) {
      continue;
    }

    rows.push({
      country: row.country,
      year: row.year,
      indicatorKey: "renewable_energy_share",
      value: row.renewable_share_percent,
      unitKey: dashboardIndicatorMap.renewable_energy_share.unitKey,
      decimals: dashboardIndicatorMap.renewable_energy_share.decimals
    });
  }

  for (const row of chartData.circularVsRecycling) {
    rows.push({
      country: row.country,
      year: row.year,
      indicatorKey: "circular_material_use_rate",
      value: row.circular_material_use_rate_percent,
      unitKey: dashboardIndicatorMap.circular_material_use_rate.unitKey,
      decimals: dashboardIndicatorMap.circular_material_use_rate.decimals
    });
  }

  for (const row of chartData.ghgPerCapita) {
    rows.push({
      country: row.country,
      year: row.year,
      indicatorKey: "ghg_per_capita",
      value: row.ghg_tonnes_per_capita,
      unitKey: dashboardIndicatorMap.ghg_per_capita.unitKey,
      decimals: dashboardIndicatorMap.ghg_per_capita.decimals
    });
  }

  for (const row of chartData.energyRecoveryOverTime) {
    if (row.country === BENCHMARK_COUNTRY) {
      continue;
    }

    rows.push({
      country: row.country,
      year: row.year,
      indicatorKey: "energy_recovery_level",
      value: row.energy_recovery_kg_per_capita,
      unitKey: dashboardIndicatorMap.energy_recovery_level.unitKey,
      decimals: dashboardIndicatorMap.energy_recovery_level.decimals
    });
  }

  return rows.sort((left, right) => {
    if (left.country !== right.country) {
      return left.country.localeCompare(right.country);
    }
    if (left.indicatorKey !== right.indicatorKey) {
      return left.indicatorKey.localeCompare(right.indicatorKey);
    }
    return left.year - right.year;
  });
}

function localizeDashboardRows(rows) {
  return rows.map((row) => ({
    ...row,
    countryLabel: countryLabel(row.country),
    indicatorLabel: indicatorLabel(row.indicatorKey),
    unitLabel: unitLabel(row.unitKey),
    formattedValue: formatDashboardValue(row)
  }));
}

function buildDashboardChartSpec(rows, state) {
  const indicatorCount = state.indicators.length;
  const countryCount = state.countries.length;
  const isTimeRange = state.startYear !== state.endYear;
  const isCompactViewport = window.innerWidth <= 700;
  const isTabletViewport = window.innerWidth <= 1024;
  const snapshotHeight = Math.max(
    isCompactViewport ? 220 : isTabletViewport ? 260 : 300,
    Math.min(
      isCompactViewport ? 360 : isTabletViewport ? 440 : 520,
      84 + countryCount * (isCompactViewport ? 14 : isTabletViewport ? 16 : 18)
    )
  );
  const snapshotFacetHeight = Math.max(
    isCompactViewport ? 140 : isTabletViewport ? 160 : 180,
    Math.min(
      isCompactViewport ? 180 : isTabletViewport ? 210 : 240,
      64 + countryCount * (isCompactViewport ? 4 : isTabletViewport ? 5 : 6)
    )
  );
  const trendFacetHeight = indicatorCount > 1
    ? (isCompactViewport ? 150 : isTabletViewport ? 165 : 180)
    : (isCompactViewport ? 220 : isTabletViewport ? 240 : 260);
  const dashboardBarPadding = isCompactViewport
    ? { left: 92, right: 18, top: 10, bottom: 10 }
    : isTabletViewport
      ? { left: 132, right: 20, top: 12, bottom: 12 }
      : { left: 176, right: 24, top: 14, bottom: 14 };
  const title = isTimeRange
    ? t("dashboard.chartTrendTitle")
    : t("dashboard.chartSnapshotTitle", { year: state.endYear });

  if (rows.length === 0) {
    return null;
  }

  if (!isTimeRange) {
    if (indicatorCount === 1) {
      return {
        $schema: "https://vega.github.io/schema/vega-lite/v5.json",
        title,
        padding: dashboardBarPadding,
        height: snapshotHeight,
        background: "transparent",
        data: { values: rows },
        mark: {
          type: "bar",
          cornerRadiusTopRight: 6,
          cornerRadiusBottomRight: 6,
          color: "#2f5d50"
        },
        encoding: {
          x: {
            field: "value",
            type: "quantitative",
            title: `${rows[0].indicatorLabel} (${rows[0].unitLabel})`
          },
          y: {
            field: "countryLabel",
            type: "nominal",
            sort: "-x",
            axis: {
              title: null,
              labelLimit: isCompactViewport ? 120 : isTabletViewport ? 180 : 260,
              labelPadding: 8,
              labelLineHeight: 14,
              tickSize: 0
            }
          },
          tooltip: [
            { field: "countryLabel", type: "nominal", title: t("charts.countryTooltip") },
            { field: "indicatorLabel", type: "nominal", title: t("charts.indicatorTooltip") },
            { field: "year", type: "quantitative", title: t("charts.yearTooltip"), format: "d" },
            { field: "formattedValue", type: "nominal", title: t("charts.valueTooltip") }
          ]
        },
        config: dashboardChartConfig()
      };
    }

      return {
        $schema: "https://vega.github.io/schema/vega-lite/v5.json",
        title,
        padding: dashboardBarPadding,
        background: "transparent",
        data: { values: rows },
      facet: {
        row: {
          field: "indicatorLabel",
          type: "nominal",
          title: null,
          sort: state.indicators.map((key) => indicatorLabel(key)),
          header: {
            labelColor: "#1f2a28",
            labelFont: "Fraunces",
            labelFontSize: 14
          }
        }
      },
      spec: {
        height: snapshotFacetHeight,
        mark: {
          type: "bar",
          cornerRadiusTopRight: 5,
          cornerRadiusBottomRight: 5,
          color: "#3f6f7f"
        },
        encoding: {
          x: { field: "value", type: "quantitative", title: t("charts.valueTooltip") },
          y: {
            field: "countryLabel",
            type: "nominal",
            sort: "-x",
            axis: {
              title: null,
              labelLimit: isCompactViewport ? 120 : isTabletViewport ? 180 : 260,
              labelPadding: 8,
              labelLineHeight: 14,
              tickSize: 0
            }
          },
          tooltip: [
            { field: "countryLabel", type: "nominal", title: t("charts.countryTooltip") },
            { field: "indicatorLabel", type: "nominal", title: t("charts.indicatorTooltip") },
            { field: "year", type: "quantitative", title: t("charts.yearTooltip"), format: "d" },
            { field: "formattedValue", type: "nominal", title: t("charts.valueTooltip") }
          ]
        }
      },
      resolve: { scale: { x: "independent" } },
      config: dashboardChartConfig()
    };
  }

  if (countryCount > 10 && indicatorCount > 3) {
    return null;
  }

  return {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    title,
    background: "transparent",
    data: { values: rows },
    facet:
      indicatorCount > 1
        ? {
            row: {
              field: "indicatorLabel",
              type: "nominal",
              title: null,
              sort: state.indicators.map((key) => indicatorLabel(key)),
              header: {
                labelColor: "#1f2a28",
                labelFont: "Fraunces",
                labelFontSize: 14
              }
            }
          }
        : undefined,
    spec: {
      height: trendFacetHeight,
      mark: {
        type: "line",
        point: true,
        strokeWidth: 2.2
      },
      encoding: {
        x: {
          field: "year",
          type: "quantitative",
          title: t("charts.yearAxis"),
          axis: { format: "d" }
        },
        y: {
          field: "value",
          type: "quantitative",
          title:
            indicatorCount === 1
              ? `${rows[0].indicatorLabel} (${rows[0].unitLabel})`
              : t("charts.valueTooltip")
        },
        detail: { field: "country", type: "nominal" },
        color: {
          field: "countryLabel",
          type: "nominal",
          title: t("charts.countryLegend"),
          legend:
            countryCount > 12
              ? null
              : {
                  orient: isCompactViewport ? "bottom" : "top",
                  direction: "horizontal"
                }
        },
        tooltip: [
          { field: "countryLabel", type: "nominal", title: t("charts.countryTooltip") },
          { field: "indicatorLabel", type: "nominal", title: t("charts.indicatorTooltip") },
          { field: "year", type: "quantitative", title: t("charts.yearTooltip"), format: "d" },
          { field: "formattedValue", type: "nominal", title: t("charts.valueTooltip") }
        ]
      }
    },
    ...(indicatorCount > 1 ? { resolve: { scale: { y: "independent" } } } : {}),
    config: dashboardChartConfig()
  };
}

function dashboardChartConfig() {
  const isCompactViewport = window.innerWidth <= 700;
  const isTabletViewport = window.innerWidth <= 1024;
  return {
    view: { stroke: null },
    axis: {
      labelColor: "#1f2a28",
      titleColor: "#1f2a28",
      gridColor: "rgba(31, 42, 40, 0.10)",
      labelFont: "Source Sans 3",
      titleFont: "Source Sans 3",
      labelLimit: isCompactViewport ? 120 : isTabletViewport ? 180 : 260,
      titleLimit: isCompactViewport ? 180 : isTabletViewport ? 240 : 320,
      labelBound: true,
      titlePadding: isCompactViewport ? 10 : 12
    },
    legend: {
      labelLimit: isCompactViewport ? 96 : 150,
      titleLimit: isCompactViewport ? 120 : 180
    },
    title: {
      color: "#1f2a28",
      font: "Fraunces",
      fontSize: isCompactViewport ? 16 : isTabletViewport ? 18 : 20,
      anchor: "start",
      lineHeight: isCompactViewport ? 20 : 24
    }
  };
}

function renderDashboardTable(rows) {
  const body = document.querySelector("#dashboard-table-body");
  const summary = document.querySelector("#dashboard-table-summary");

  if (!body || !summary) {
    return;
  }

  if (rows.length === 0) {
    body.innerHTML = `
      <tr>
        <td colspan="4">${t("dashboard.tableEmpty")}</td>
      </tr>
    `;
    summary.textContent = t("dashboard.tableRowsEmpty");
    return;
  }

  const sortedRows = [...rows].sort((left, right) => {
    if (left.country !== right.country) {
      return left.country.localeCompare(right.country);
    }
    if (left.indicatorKey !== right.indicatorKey) {
      return left.indicatorKey.localeCompare(right.indicatorKey);
    }
    return left.year - right.year;
  });

  body.innerHTML = sortedRows
    .map(
      (row) => `
        <tr>
          <td>${row.countryLabel}</td>
          <td>${row.indicatorLabel}</td>
          <td>${row.year}</td>
          <td>${row.formattedValue}</td>
        </tr>
      `
    )
    .join("");

  summary.textContent = t("dashboard.tableRows", { count: rows.length });
}

function renderDashboardSummary(rows, state, noteText) {
  const summary = document.querySelector("#dashboard-summary");
  const note = document.querySelector("#dashboard-note");

  if (!summary || !note) {
    return;
  }

  if (rows.length === 0) {
    summary.textContent = t("dashboard.summaryEmpty");
  } else {
    summary.textContent = t("dashboard.summary", {
      countries: state.countries.length,
      indicators: state.indicators.length,
      startYear: state.startYear,
      endYear: state.endYear
    });
  }

  note.textContent = noteText;
}

async function renderDashboardChart(rows, state) {
  const container = document.querySelector("#dashboard-chart");
  if (!container) {
    return;
  }

  const spec = buildDashboardChartSpec(rows, state);

  if (!spec) {
    container.innerHTML = `
      <div class="chart-error">
        <strong>${t("dashboard.chartDenseTitle")}</strong>
        <p>${t("dashboard.chartDenseText")}</p>
      </div>
    `;
    return;
  }

  try {
    const responsiveSpec = applyResponsiveChartSpec(spec, container, {
      minWidth: window.innerWidth <= 700 ? 280 : 420
    });
    await vegaEmbed(container, responsiveSpec, { actions: false, renderer: "svg" });
  } catch (error) {
    console.error("Failed to render dashboard chart:", error);
    container.innerHTML = `
      <div class="chart-error">
        <strong>${t("dashboard.chartErrorTitle")}</strong>
        <p>${t("dashboard.chartErrorText")}</p>
      </div>
    `;
  }
}

function setupDashboardPicker(select, config) {
  const group = select.closest(".dashboard-control-group");
  if (!group) {
    return { sync: () => {} };
  }

  group.querySelector(".filter-picker")?.remove();
  select.classList.add("dashboard-control-group__select--hidden");

  const picker = createCheckboxPicker({
    labelText: config.labelText,
    options: config.options,
    selected: config.selected,
    nounKey: config.nounKey,
    defaultMessage: config.defaultMessage,
    onChange: config.onChange,
    formatOption: config.formatOption
  });

  group.insertBefore(picker.element, select);
  return picker;
}

function renderDashboard() {
  const countrySelect = document.querySelector("#dashboard-countries");
  const indicatorSelect = document.querySelector("#dashboard-indicators");
  const yearStartSelect = document.querySelector("#dashboard-year-start");
  const yearEndSelect = document.querySelector("#dashboard-year-end");
  const resetButton = document.querySelector("#dashboard-reset");

  if (
    !countrySelect ||
    !indicatorSelect ||
    !yearStartSelect ||
    !yearEndSelect ||
    !resetButton
  ) {
    return;
  }

  const dashboardRows = buildDashboardDataset();
  const availableCountries = Array.from(new Set(dashboardRows.map((row) => row.country))).sort(
    (left, right) => left.localeCompare(right)
  );
  const availableYears = Array.from(new Set(dashboardRows.map((row) => row.year))).sort(
    (left, right) => left - right
  );

  const defaultState = {
    countries: availableCountries.slice(),
    indicators: [
      "municipal_waste_per_capita",
      "recycling_share",
      "renewable_energy_share"
    ],
    startYear: 2023,
    endYear: 2023
  };

  if (!dashboardRuntimeState) {
    dashboardRuntimeState = cloneState(defaultState);
  }

  dashboardRuntimeState.countries = dashboardRuntimeState.countries.filter((country) =>
    availableCountries.includes(country)
  );
  if (dashboardRuntimeState.countries.length === 0) {
    dashboardRuntimeState.countries = defaultState.countries.slice();
  }

  dashboardRuntimeState.indicators = dashboardRuntimeState.indicators.filter((indicator) =>
    DASHBOARD_INDICATORS.some((item) => item.key === indicator)
  );
  if (dashboardRuntimeState.indicators.length === 0) {
    dashboardRuntimeState.indicators = defaultState.indicators.slice();
  }

  if (!availableYears.includes(dashboardRuntimeState.startYear)) {
    dashboardRuntimeState.startYear = defaultState.startYear;
  }
  if (!availableYears.includes(dashboardRuntimeState.endYear)) {
    dashboardRuntimeState.endYear = defaultState.endYear;
  }

  countrySelect.innerHTML = "";
  indicatorSelect.innerHTML = "";
  yearStartSelect.innerHTML = "";
  yearEndSelect.innerHTML = "";

  for (const country of availableCountries) {
    const option = document.createElement("option");
    option.value = country;
    option.textContent = countryLabel(country);
    option.selected = dashboardRuntimeState.countries.includes(country);
    countrySelect.append(option);
  }

  for (const indicator of DASHBOARD_INDICATORS) {
    const option = document.createElement("option");
    option.value = indicator.key;
    option.textContent = `${indicatorLabel(indicator.key)} (${unitLabel(indicator.unitKey)})`;
    option.selected = dashboardRuntimeState.indicators.includes(indicator.key);
    indicatorSelect.append(option);
  }

  for (const year of availableYears) {
    const startOption = document.createElement("option");
    startOption.value = String(year);
    startOption.textContent = String(year);
    startOption.selected = year === dashboardRuntimeState.startYear;
    yearStartSelect.append(startOption);

    const endOption = document.createElement("option");
    endOption.value = String(year);
    endOption.textContent = String(year);
    endOption.selected = year === dashboardRuntimeState.endYear;
    yearEndSelect.append(endOption);
  }

  const countryPicker = setupDashboardPicker(countrySelect, {
    labelText: t("dashboard.countries"),
    options: availableCountries,
    selected: dashboardRuntimeState.countries,
    nounKey: "countriesNoun",
    defaultMessage: t("dynamic.filterDefaults"),
    onChange: (nextValues) => {
      dashboardRuntimeState.countries = nextValues;
      rerenderDashboard();
    },
    formatOption: countryLabel
  });

  const indicatorPicker = setupDashboardPicker(indicatorSelect, {
    labelText: t("dashboard.indicators"),
    options: DASHBOARD_INDICATORS.map((indicator) => indicator.key),
    selected: dashboardRuntimeState.indicators,
    nounKey: "indicatorsNoun",
    defaultMessage: t("dynamic.allOptionsDefault"),
    onChange: (nextValues) => {
      dashboardRuntimeState.indicators = nextValues;
      rerenderDashboard();
    },
    formatOption: (value) => `${indicatorLabel(value)} (${unitLabel(dashboardIndicatorMap[value].unitKey)})`
  });

  function updateStateFromControls() {
    dashboardRuntimeState.countries = selectedValues(countrySelect);
    dashboardRuntimeState.indicators = selectedValues(indicatorSelect);
    dashboardRuntimeState.startYear = Number(yearStartSelect.value);
    dashboardRuntimeState.endYear = Number(yearEndSelect.value);

    if (dashboardRuntimeState.startYear > dashboardRuntimeState.endYear) {
      const swap = dashboardRuntimeState.startYear;
      dashboardRuntimeState.startYear = dashboardRuntimeState.endYear;
      dashboardRuntimeState.endYear = swap;
      yearStartSelect.value = String(dashboardRuntimeState.startYear);
      yearEndSelect.value = String(dashboardRuntimeState.endYear);
    }

    countryPicker.setSelected(dashboardRuntimeState.countries);
    indicatorPicker.setSelected(dashboardRuntimeState.indicators);
  }

  async function rerenderDashboard() {
    updateStateFromControls();

    const noteParts = [];
    const filteredRows = localizeDashboardRows(
      dashboardRows
        .filter((row) => dashboardRuntimeState.countries.includes(row.country))
        .filter((row) => dashboardRuntimeState.indicators.includes(row.indicatorKey))
        .filter(
          (row) =>
            row.year >= dashboardRuntimeState.startYear &&
            row.year <= dashboardRuntimeState.endYear
        )
    );

    const selectedKeys = new Set(dashboardRuntimeState.indicators);
    if (dashboardRuntimeState.startYear !== dashboardRuntimeState.endYear) {
      const snapshotOnly = [
        "municipal_waste_per_capita",
        "recycling_share",
        "landfill_share",
        "energy_recovery_share",
        "circular_material_use_rate",
        "ghg_per_capita"
      ].filter((key) => selectedKeys.has(key));

      if (snapshotOnly.length > 0) {
        noteParts.push(t("dashboard.noteSparse"));
      }
    }

    if (
      dashboardRuntimeState.countries.length === 0 ||
      dashboardRuntimeState.indicators.length === 0
    ) {
      noteParts.push(t("dashboard.noteNeedSelection"));
    }

    renderDashboardSummary(
      filteredRows,
      dashboardRuntimeState,
      noteParts[0] || t("dashboard.noteAutoUpdate")
    );
    renderDashboardTable(filteredRows);
    await renderDashboardChart(filteredRows, dashboardRuntimeState);
  }

  countrySelect.onchange = rerenderDashboard;
  indicatorSelect.onchange = rerenderDashboard;
  yearStartSelect.onchange = rerenderDashboard;
  yearEndSelect.onchange = rerenderDashboard;
  resetButton.onclick = () => {
    dashboardRuntimeState = cloneState(defaultState);
    setMultiSelectValues(countrySelect, defaultState.countries);
    setMultiSelectValues(indicatorSelect, defaultState.indicators);
    yearStartSelect.value = String(defaultState.startYear);
    yearEndSelect.value = String(defaultState.endYear);
    rerenderDashboard();
  };

  rerenderDashboard();
}

function renderEmptyChartMessage(container) {
  container.innerHTML = `
    <div class="chart-error">
      <strong>${t("dynamic.noChartDataTitle")}</strong>
      <p>${t("dynamic.noChartDataText")}</p>
    </div>
  `;
}

async function renderSingleChart(chart, state) {
  const container = document.querySelector(chart.selector);
  if (!container) {
    return;
  }

  const spec = chart.buildSpec(state);
  if (!spec) {
    renderEmptyChartMessage(container);
    return;
  }

  try {
    const responsiveSpec = applyResponsiveChartSpec(spec, container, {
      minWidth: window.innerWidth <= 700 ? 280 : 480
    });
    await vegaEmbed(container, responsiveSpec, { actions: false, renderer: "svg" });
  } catch (error) {
    console.error(`Failed to render ${chart.id}:`, error);
    container.innerHTML = `
      <div class="chart-error">
        <strong>${t("dynamic.chartLoadErrorTitle")}</strong>
        <p>${t("dynamic.chartLoadErrorText", { id: chart.id })}</p>
      </div>
    `;
  }
}

function createChartControls(chart, state, rerender) {
  const container = document.querySelector(chart.selector);
  const section = container ? container.closest(".section-card") : null;

  if (!container || !section || !chart.controls || chart.controls.length === 0) {
    return;
  }

  section.querySelector(`[data-chart-controls="${chart.id}"]`)?.remove();

  const controlsWrap = document.createElement("div");
  controlsWrap.className = "chart-controls";
  controlsWrap.dataset.chartControls = chart.id;

  const header = document.createElement("div");
  header.className = "chart-controls__header";

  const helper = document.createElement("p");
  helper.className = "chart-controls__helper";
  helper.textContent = t("dynamic.filterDefaults");
  header.append(helper);

  const resetButton = document.createElement("button");
  resetButton.type = "button";
  resetButton.className = "chart-controls__reset";
  resetButton.textContent = t("dynamic.resetFilters");
  resetButton.addEventListener("click", () => {
    const nextState = cloneState(chart.defaultState);
    Object.keys(nextState).forEach((key) => {
      state[key] = nextState[key];
    });
    chartRuntimeStates.set(chart.id, cloneState(state));
    createChartControls(chart, state, rerender);
    rerender();
  });
  header.append(resetButton);
  controlsWrap.append(header);

  const grid = document.createElement("div");
  grid.className = "chart-controls__grid";

  for (const control of chart.controls) {
    const group = document.createElement("div");
    group.className = "chart-control-group filter-card";
    const labelText = control.labelKey ? t(control.labelKey) : control.label;
    const helpText = control.helpKey ? t(control.helpKey) : control.help;

    if (control.type === "multiselect") {
      const picker = createCheckboxPicker({
        labelText,
        options: control.options,
        selected: state[control.key],
        nounKey: control.nounKey || "optionsNoun",
        defaultMessage: t("dynamic.allOptionsDefault"),
        onChange: (nextValues) => {
          state[control.key] = nextValues;
          chartRuntimeStates.set(chart.id, cloneState(state));
          rerender();
        },
        formatOption: control.formatOption || ((value) => value)
      });

      group.append(picker.element);
    }

    if (control.type === "checkbox-group") {
      const { meta, status } = createFilterMeta(labelText, t("dynamic.allOptionsDefault"));
      const list = document.createElement("div");
      list.className = "chart-control-group__checks";

      const updateSummary = () => {
        status.textContent = selectionSummary(
          state[control.key].length,
          control.options.length,
          control.nounKey || "optionsNoun"
        );
      };

      for (const optionValue of control.options) {
        const itemLabel = document.createElement("label");
        itemLabel.className = "chart-check";

        const input = document.createElement("input");
        input.type = "checkbox";
        input.value = optionValue;
        input.checked = state[control.key].includes(optionValue);
        input.addEventListener("change", () => {
          state[control.key] = Array.from(list.querySelectorAll("input:checked")).map(
            (element) => element.value
          );
          chartRuntimeStates.set(chart.id, cloneState(state));
          updateSummary();
          rerender();
        });

        const text = document.createElement("span");
        text.textContent = control.formatOption ? control.formatOption(optionValue) : optionValue;

        itemLabel.append(input, text);
        list.append(itemLabel);
      }

      const allButton = createActionButton(t("dynamic.selectAll"), () => {
        state[control.key] = control.options.slice();
        Array.from(list.querySelectorAll("input")).forEach((input) => {
          input.checked = true;
        });
        chartRuntimeStates.set(chart.id, cloneState(state));
        updateSummary();
        rerender();
      });

      const clearButton = createActionButton(t("dynamic.clearAll"), () => {
        state[control.key] = [];
        Array.from(list.querySelectorAll("input")).forEach((input) => {
          input.checked = false;
        });
        chartRuntimeStates.set(chart.id, cloneState(state));
        updateSummary();
        rerender();
      });

      group.append(meta, createActionRow([allButton, clearButton]), list);
      updateSummary();
    }

    if (control.type === "checkbox") {
      const { meta, status } = createFilterMeta(labelText, t("dynamic.checkboxDefault"));
      const itemLabel = document.createElement("label");
      itemLabel.className = "chart-check";

      const input = document.createElement("input");
      input.type = "checkbox";
      input.checked = Boolean(state[control.key]);
      input.addEventListener("change", () => {
        state[control.key] = input.checked;
        chartRuntimeStates.set(chart.id, cloneState(state));
        status.textContent = input.checked ? t("dynamic.enabled") : t("dynamic.disabled");
        rerender();
      });

      const text = document.createElement("span");
      text.textContent = labelText;

      itemLabel.append(input, text);
      group.append(meta, itemLabel);
      status.textContent = input.checked ? t("dynamic.enabled") : t("dynamic.disabled");
    }

    if (helpText) {
      const help = document.createElement("p");
      help.className = "chart-control-group__help";
      help.textContent = helpText;
      group.append(help);
    }

    grid.append(group);
  }

  controlsWrap.append(grid);
  section.insertBefore(controlsWrap, container);
}

async function embedCharts() {
  for (const chart of chartConfigs) {
    if (!chartRuntimeStates.has(chart.id)) {
      chartRuntimeStates.set(chart.id, cloneState(chart.defaultState));
    }

    const state = chartRuntimeStates.get(chart.id);
    createChartControls(chart, state, () => {
      chartRuntimeStates.set(chart.id, cloneState(state));
      renderSingleChart(chart, state);
    });
    await renderSingleChart(chart, state);
  }
}

async function rerenderLocalizedUi() {
  renderKeyFacts();
  renderCountryExplorer();
  await embedCharts();
  renderDashboard();
}

async function initializePage() {
  await rerenderLocalizedUi();
  siteI18n.subscribe(() => {
    rerenderLocalizedUi();
  });

  window.addEventListener("resize", () => {
    clearTimeout(resizeRerenderTimeout);
    resizeRerenderTimeout = window.setTimeout(() => {
      rerenderLocalizedUi();
    }, 140);
  });
}

document.addEventListener("DOMContentLoaded", initializePage);
